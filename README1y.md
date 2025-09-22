- npm install mongodb
promises
run against google lighthouse
don't have to change main.js at all?
when do you need a header?  writeHead
had to install ndoe version 20

to do:
add drop down

npm i express express-session mongodb bcrypt dotenv


https://cloud.mongodb.com/v2/68cff3dd968e334e1843f3cb#/security/network/accessList

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" to get session secret

https://www.mongodb.com/docs/manual/core/security-users/


mongodb+srv://<db_username>:<db_password>@clustera3.v9i2btl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterA3


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<db_username>:<db_password>@clustera3.v9i2btl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterA3";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
