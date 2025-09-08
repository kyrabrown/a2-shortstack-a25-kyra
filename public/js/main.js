// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
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
    body 
  })

  const text = await response.text()
  console.log( "text:", text ) // awaits response and prints it 
}

// helper function to show results on webpage screen
function updateResults(rows) {
  const resultsBody = document.getElementById("results-body"); // get results table using id
  resultsBody.innerHTML = ""; // clear exisitng rows
  rows.forEach(r => { // loop through each object
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td> 
      <td>${r.name}</td>
      <td>${r.drink}</td>
      <td>${r.food}</td>
      <td>${r.createdOn}</td>
      <td>${r.readyInMin}</td>
    `;
    resultsBody.appendChild(tr); // append / add to webpage
  });
}

// function to get results
const getResults = async function() {
  console.log("getting results..") // awaits response and prints it 
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  // const results = await fetch ( "/results" );
  const results = await fetch( "/results");

  const info = await results.json();
  updateResults(info.data); // get the .data of teh info (results converted to json)
  console.log( "data:", info ) // awaits response and prints it 
}

window.onload = function() {
  const button = document.querySelector("#submit-btn");
  button.onclick = submit;

  // reuslts button
  const resultsButton = document.querySelector("#show-results");
  resultsButton.onclick = getResults;
  
}
