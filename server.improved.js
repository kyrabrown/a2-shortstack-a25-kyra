require('dotenv').config();

const express    = require('express'),
      app        = express(),
      dir  = "public/"

const port       = 3000

const session = require("express-session");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

// add these globals so routes can use them after connect()
let client;
let db;

// create collections
let Users;
let Orders;

// let nextId = 1; // will start at 1 and go up
// let orders = [ // like appdata, save data in dictionary
//   // { "yourname": "kyra", "yourdrink": latte, "yourfood": croissant },
// ];

// middleware //
app.use( express.static( 'public' ) ) // serve static files from public/
app.use( express.static( 'views'  ) )
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true} // 8 hours
  })
);

// Allows us to handle JSON in certain ways on the server side
// If JSON is sent by the client, just tack it on to the request body
// Allows us to do req.body.newdream farther down
// Only want to use it for JSON data



// MongoDB connection setup
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority&appName=ClusterA3`;
// const uri0 = `mongodb+srv://ss${process.env.USERNM}:${process.env.PASS}@${proce.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
// 
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const dbName = process.env.MONGO_DB || 'a3';
    db = client.db(dbName); 

    Users = db.collection('users');
    Orders = db.collection('orders');
    await Users.createIndex({ username: 1 }, { unique: true });
    console.log("Created orders and users collection");
  // } finally {
  //   // Ensures that the client will close when you finish/error
  //   await client.close();
  // }
}
run().catch(console.dir);

// logic for derived field (prep time in minutes)
function getPrepTimeInMin(drink, food) {
  // everything's gotta take atleast a minute
  let mins = 1; // base case if they order something not accounted for 
  if (drink) {
    const d = drink.toLowerCase(); // easier to parse with all lowercase
    if (d.includes("latte") || d.includes("tea")) mins += 3;
    else if (d.includes("hot")) mins += 2;
    else if (d.includes("cold")) mins += 1;
    else if (d.includes("refresher")) mins += 4;
    else if (d.includes("frap")) mins += 5;
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

// helper functions for log in
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'not authenticated' });
  next();
}

// POST /auth/login  { username, password }
// Create account if missing (allowed by A3). Hash passwords!
app.post('/auth/login', async (req, res) => {
  const { username = '', password = '' } = req.body || {};
  const u = username.trim();
  if (!u || !password) return res.status(400).json({ error: 'username and password required' });

  let user = await Users.findOne({ username: u });
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await Users.insertOne({ username: u, passwordHash, createdAt: new Date() });
    req.session.userId = result.insertedId.toString();
    console.log("Created new user", u);
    return res.json({ ok: true, created: true, username: u });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  req.session.userId = user._id.toString();
  res.json({ ok: true, created: false, username: u });
  console.log("User logged in:", u);
});

app.get('/auth/me', (req, res) => {
  res.json({ authenticated: !!req.session.userId, userId: req.session.userId || null });
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// routes for express //
// GET all orders
app.get('/results', async (req, res) => {
  const all = await Orders.find({}).sort({ _id: 1 }).toArray();
  res.json({ data: all });
});

// POST new order
app.post('/submit', async (req, res) => {
  const { yourname = '', yourdrink = '', yourFood = '' } = req.body || {};
  const doc = {
    name: yourname.trim(),
    drink: yourdrink.trim(),
    food: yourFood.trim(),
    createdOn: new Date().toISOString(),
    readyInMin: getPrepTimeInMin(yourdrink, yourFood)
  };
  await Orders.insertOne(doc);
  const all = await Orders.find({}).sort({ _id: 1 }).toArray();
  res.json({ data: all });
});

// POST edit { id, yourname?, yourdrink?, yourFood? }
app.post('/edit', async (req, res) => {
  const { id, yourname, yourdrink, yourFood } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });

  const _id = new ObjectId(id);
  const existing = await Orders.findOne({ _id });
  if (!existing) return res.status(404).json({ error: 'order not found' });

  const updated = {
    name:  typeof yourname  === 'string' ? yourname.trim()  : existing.name,
    drink: typeof yourdrink === 'string' ? yourdrink.trim() : existing.drink,
    food:  typeof yourFood  === 'string' ? yourFood.trim()  : existing.food
  };
  updated.readyInMin = getPrepTimeInMin(updated.drink, updated.food);

  await Orders.updateOne({ _id }, { $set: updated });
  const all = await Orders.find({}).sort({ _id: 1 }).toArray();
  res.json({ data: all });
});

// POST delete { id }
app.post('/delete', async (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  await Orders.deleteOne({ _id: new ObjectId(id) });
  const all = await Orders.find({}).sort({ _id: 1 }).toArray();
  res.json({ data: all });
});

// 404 fallback for unknown routes
// app.use((req, res) => {
//   res.status(404).type("text").send("404 Not Found");
// });

app.listen( process.env.PORT || port )
