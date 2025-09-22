// FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function( event ) {
  event.preventDefault();
  console.log("submitting data..") 
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const nameInput = document.querySelector( "#yourname" ),
    drinkInput = document.querySelector( "#yourdrink" ),
    foodInput = document.querySelector( "#yourfood" );

  const json = {
    yourname:  nameInput.value,
    yourdrink: drinkInput.value,
    yourFood:  foodInput.value
  };

  const body = JSON.stringify( json );
  
  const response = await fetch( "/submit", { // the request URL that will show up on server
    // code can explicitly look for this /submit
    // headers: { "Content-Type": "application/json" }, // add header since using json info
    method:"POST",
    credentials: "same-origin", // include cookies to track current user
    headers: { "Content-Type": "application/json" },
    body 
  })

  const text = await response.text()
  console.log( "text:", text ) // awaits response and prints it 
}

// Mongo _id can be an object; normalize to a string for UI/data-id
function getId(doc) {
  const v = doc && doc._id;
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') return v.$oid || v.toString?.() || '';
  return String(v);
}

// helper function to show results on webpage screen
function updateResults(rows) {
  const resultsBody = document.getElementById("results-body"); // get results table using id
  if (!resultsBody) return;
  resultsBody.innerHTML = ""; // clear exisitng rows
  rows.forEach(r => { // loop through each object
    const id = getId(r);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${id}</td> 
      <td>${r.name}</td>
      <td>${r.drink}</td>
      <td>${r.food}</td>
      <td>${r.createdOn}</td>
      <td>${r.readyInMin}</td>
      <td><button class="edit-btn" data-id="${id}">Edit</button></td>
      <td><button class="delete-btn" data-id="${id}">Delete</button></td>
    `;
    resultsBody.appendChild(tr); // append / add to webpage
  });
}

// function to get results
const getResults = async function() {
  console.log("getting results..") // awaits response and prints it 

  const results = await fetch( "/results");

  const info = await results.json();
  updateResults(info.data); // get the .data of teh info (results converted to json)
  console.log( "data:", info ) // awaits response and prints it 
}

// function to get results
const editOrder = async function(event) {
  console.log("Editing order..") // awaits response and prints it 

  event.preventDefault()

  const response = await fetch( "/edit", { // the request URL that will show up on server
    // code can explicitly look for this /submit
    // headers: { "Content-Type": "application/json" }, // add header since using json info
    method:"POST",
    credentials: "same-origin", // include cookies to track current user
    headers: { "Content-Type": "application/json" },
    body 
  })

  const text = await response.text()
  console.log( "text:", text ) // awaits response and prints it 

  updateResults(info.data); // get the .data of teh info (results converted to json)
}

window.onload = function() {
  const button = document.querySelector("#submit-btn");
  button.onclick = submit;

  // reuslts button
  const resultsButton = document.querySelector("#show-results");
  resultsButton.onclick = getResults;
  
  // delete button in table click handler, add it to results body (where button resides)
  const res = document.getElementById("results-body");
  if (res) {
    res.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".delete-btn"); // get closeset delete button
      const editBtn = e.target.closest(".edit-btn"); // get edit delete button
      
      // Clicked neither? Bail.
      if (!deleteBtn && !editBtn) return;

      // delete
      if (deleteBtn) {
        // get id (that specific row in the table for that order)
        const id = Number(deleteBtn.dataset.id); // (in data-id)
        console.log("Deleting oreder id: " + id);
        if (!Number.isFinite(id)) return;
      
        // Ask the server to delete this row, then redraw
        const results = await fetch("/delete", { // need to add this to handlePost
          method: "POST", // just make it a post request (not DELETE for simplicity)
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }) // send id as a string
        });
      
        const info = await results.json();
        updateResults(info.data); // get the .data of teh info (results converted to json)
        console.log( "data:", info ) // awaits response and prints it 
      }

      // edit
      if (editBtn) {
        const id = Number(editBtn.dataset.id); // (in data-id)
        console.log("Editng oreder id: " + id);
        if (!Number.isFinite(id)) return;

        // get closest table row to button
        const tr = editBtn.closest("tr");
        const currentName  = tr.children[1].textContent;
        const currentDrink = tr.children[2].textContent;
        const currentFood  = tr.children[3].textContent;

        const newName  = prompt("Edit name:",  currentName);
        if (newName === null) return; // user decided not to order this
        const newDrink = prompt("Edit drink:", currentDrink);
        if (newDrink === null) return;
        const newFood  = prompt("Edit food:",  currentFood);
        if (newFood === null) return;

        const res = await fetch("/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            yourname: newName,
            yourdrink: newDrink,
            yourFood: newFood
          })
        });    
        const info = await res.json();
        updateResults(info.data); // get the .data of teh info (results converted to json)
        console.log( "data:", info ) // awaits response and prints it 
      }

    });
  }
}

// function to show/hide app vs login
function showApp(loggedIn) {
  const login = document.getElementById("login-section");
  const app = document.getElementById("app");
  if (!login || !app) return;
  if (loggedIn) { // if logged in, hide login, show app
    login.hidden = true;
    app.hidden = false;
  } else { // vice versa
    login.hidden = false;
    app.hidden = true;
  }
}

// for authentication sign in
async function checkAuth() {
  const res = await fetch("/auth/me", {credentials: 'same-origin'});
  const me = await res.json();
  const authed = me.authenticated;
  showApp(authed);
  // document.getElementById("auth").style.display = authed ? "none" : "block";
  // document.getElementById("app").style.display  = authed ? "block" : "none";
  if (authed) await getResults();
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("login-msg").textContent =
    data.error || (data.created ? "Account created!" : "Logged in!");

  await checkAuth();
});

document.getElementById("logout").addEventListener("click", async () => {
  await fetch("/auth/logout", { method: "POST" });
  await checkAuth();
});

window.addEventListener("load", checkAuth);