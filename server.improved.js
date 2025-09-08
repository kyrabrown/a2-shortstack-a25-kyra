const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

let nextId = 1; // will start at 1 and go up
let orders = [ // like appdata, save data in dictionary
  // { "yourname": "kyra", "yourdrink": latte, "yourfood": croissant },
];

// logic for derived field
// function for getting derived field (prepTIme)
function getPrepTimeInMin(drink, food) {
  let mins = 1; // base case if they order something not accounted for 
  if (drink) {
    const d = drink.toLowerCase(); // easier to parse with all lowercase
    if (d.includes("latte") || d.includes("tea")) mins += 3;
    else if (d.includes("hot")) mins += 2;
    else if (d.includes("cold")) mins += 1;
    else if (d.includes("refresher")) mins += 4;
    else if (d.includes("frapp")) mins += 5;
  }
  if (food) {
    const f = food.toLowerCase();
    if (f.includes("sandwich")) mins += 4;
    else if (f.includes("bagel")) mins += 2;
    else if (f.includes("cake")) mins += 3;
    else if (f.includes("pastry")) mins += 1;
  }
  return mins;
}


const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){ // have post request
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  // **just an idea of what you CAN do
  let url = request.url.slice( 1 );

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }
  else if (url === "results") {
    response.writeHead(200, {"Content-Type": "application/json" }); // success code 200
    return response.end(JSON.stringify({ data: orders }));
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) { // take in data and read as packets
      dataString += data 
  })

  request.on( "end", function() { // wait until get all chunks to write to console
      let payload = {};
      try {
        payload = dataString ? JSON.parse(dataString) : {};
      } catch {
        response.writeHead(400, {"Content-Type": "application/json" });
        return response.end(JSON.stringify({ error: "Invalid JSON" }));
      }
      // print payload
      console.log( payload );

      if (request.url === "/submit") {
      const name  = (payload.yourname  || "").toString().trim();
      const drink = (payload.yourdrink || "").toString().trim();
      const food  = (payload.yourFood  || payload.yourfood || "").toString().trim();

      console.log( "Saving information to table.. ")

      const createdOn = new Date().toISOString(); // use today's date
      const readyInMin = getPrepTimeInMin(drink, food);

      orders.push({
        id: nextId++,
        name,
        drink,
        food,
        createdOn,
        readyInMin
      });
      // ... do something with the data here!!!

      console.log(orders);
  
      response.writeHead( 200, "OK", {"Content-Type": "application/json" }) // return 200 success
      return response.end(JSON.stringify({ data: orders }));
      // response.end("test")
    }
  }
)
response.writeHead(404, { "Content-Type": "text/plain" });
response.end("404 Not Found");
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port )
