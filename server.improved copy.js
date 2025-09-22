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
  // everything's gotta take atleast a minute
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
    console.log("Getting results for all orders...")
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

      // console.log("All Orders:  ");
      // console.log(orders); // print all orders
      console.log( "Sucessfully added order.")
      response.writeHead( 200, "OK", {"Content-Type": "application/json" }) // return 200 success
      return response.end(JSON.stringify({ data: orders }));
      // response.end("test")
    }

    else if (request.url === "/edit") {
      const id = Number(payload.id); // get id (row)
      // if (!Number.isFinite(id)) {
      //   response.writeHead(400, { "Content-Type": "application/json" });
      //   return response.end(JSON.stringify({ error: "id required" }));
      // }
      
      console.log( "Editing order id: " + id);

      // get that order id (since ids are unique)
      const order = orders.find(o => o.id === id);
      if (!order) {
        return response.end(JSON.stringify({ error: "order not found" }));
      }

        // update fields (if provided)
        if (payload.yourname) order.name = payload.yourname;
        if (payload.yourdrink) order.drink = payload.yourdrink;
        if (payload.yourFood) order.food = payload.yourFood;

        // recalc derived field
        order.readyInMin = getPrepTimeInMin(order.drink, order.food);

      console.log( "Sucessfully edited order.")
      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({ data: orders }));
    }

    else if (request.url === "/delete") {
      const id = Number(payload.id); // get id (row)
      // if (!Number.isFinite(id)) {
      //   response.writeHead(400, { "Content-Type": "application/json" });
      //   return response.end(JSON.stringify({ error: "id required" }));
      // }
      
      console.log( "Deleting order id: " + id);

      // filter out that order id row (since ids are unique)
      orders = orders.filter(o => o.id !== id);

      console.log( "Sucessfully deleted order.")
      response.writeHead(200, { "Content-Type": "application/json" });
      return response.end(JSON.stringify({ data: orders }));
    }

    console.log( "Error in processing order.")
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 Not Found");
  })
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
