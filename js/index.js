//lets do this add event listener whenever dom load
document.addEventListener("DOMContentLoaded", () => {

    //let me get all the html elements and store them in a variable
    const myform = document.getElementById('github-form');
    const myUsers = document.getElementById('user-list');
    const myRepos = document.getElementById('repos-list');
  
    // i want the form to have a functionality to submit, so i will add event listener to it
    myform.addEventListener("submit", (event) => {
        //first i need to prevent default form behavior
      event.preventDefault(); 

      //my target is input with id search
      const mysearch = document.getElementById('search').value.trim();
        
      //a condition that first check if there is and actual input keyed to search
      if (!mysearch) {
        //when it find the input its not there, i will alert the user to actually key it in
        alert("Please enter a search term.");
        return;
      }
      //once keyed in it clear the previous search to give room for current search
      // Clear previous results
      myUsers.innerHTML = "";
      myRepos.innerHTML = "";
  
      //then i will call the function that actuallly help me search 
      searchUsers(mysearch);
    });
  
    // here comes the function that help me do the searching
    //it has to take my search input element as an argument
    function searchUsers(mysearch) {
        //i call the fetch with the url that takes specific search
      fetch(`https://api.github.com/search/users?q=${mysearch}`)
      //as usual first then for parsing the json
        .then((response) => response.json())
        //second then that take the parsed json and give us data
        .then((data) => {
            //set a condition that there is actual data, no 0 or nulls
          if (!data.items || data.items.length === 0) {
            //when absent we update our specific html element that has user list to say we didn't find any user
            myUsers.innerHTML = "<li>No users found.</li>";
            return;
          }
          
          //here comes the fun part the for each loop that itearate over each user if found
          // we need to store these users we find in a list element will create
          data.items.forEach((user) => {

            //so we create where will store these users will find
            const userItem = document.createElement("li");

            //then add metadata to our  html element to our user we find
            userItem.innerHTML = `
              <img src="${user.avatar_url}" alt="${user.login}'s avatar" style="width:50px;">
              <span>${user.login}</span>
              <a href="${user.html_url}" target="_blank">View Profile</a>
              <button data-username="${user.login}">View Repos</button>
            `;
            
            // we ensure that we add event listener once the button is clicked to our userItem we found
            userItem.querySelector("button").addEventListener("click", () => {
              fetchUserRepos(user.login);
            });
            //with all this for it to be effective we have to add it to its parent html element
            myUsers.appendChild(userItem);
          });
        })

        //not forgeting to catch those errors
        .catch((error) => {
          console.error("Error fetching users:", error);
          myUsers.innerHTML = "<li>Error fetching users.</li>";
        });
    }
  
    // We have completed ability to search a specific user, not we watch to fetch repositories
    // so a function that search our repos, a repo is identified by ones user name, 
    // so this function will take username as an argument
    function repoSearch(username) {
        // so will be doing this on the li element 
        myRepos.innerHTML = "<li>Loading repos...</li>";
        // here comes our fetch
        fetch(`https://api.github.com/users/${username}/repos`)
            //parse our json on first then
            .then((response) => response.json())
            //second then that take the parsed json and give us data of our repo
            .then((repos) => {
                //we start with no repo so we can populate it
            myRepos.innerHTML = ""; 
    
            //check with if condition on if we have respo once we search/
            //start by if we have none
            if (!repos || repos.length === 0) {
                //tell the user search we havn't found any repo
                myRepos.innerHTML = "<li>No repositories found.</li>";
                return;
            }
    
            //now in incident we have repos present the for each fun comes in
            //we have to go through every repo of repos present and store them in li element we need to create
            repos.forEach((repo) => {

                //we create the li element
                const myrepoLi = document.createElement('li');

                //so we adding it to inner html
                myrepoLi.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                `;

                //for all this to be in effect we have to add it to its parent element 
                myRepos.appendChild(myrepoLi);
            });
            })
            //not forgetting errors
            .catch((error) => {
            console.error("Error fetching repositories:", error);
            myRepos.innerHTML = "<li>Error fetching repositories.</li>";
            });
        }
  });
  