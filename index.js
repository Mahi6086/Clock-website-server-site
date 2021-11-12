const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

/* Fppk4W4uhOGaUelg
niche12
*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfmbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("niche12");
    const servicesCollection = database.collection("services");
    const orderCollection = database.collection("order");

    // GET API
    app.get("/services", async (req, res) => {
      let query = {};
      const email = req.body.email;
      if (email) {
        query = { email: email };
      }
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.json(services);
    });

    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //Add Product
    app.post("/addProducts", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });

    // manageAllOrders
    app.get("/manageAllOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });
    // manageOrders
    app.get("/manageOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });
    //myOrders
    app.get("/myOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    // Pending to Approved API
    app.put("/updateStatus", async (req, res) => {
      const id = req.body.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Approved",
        },
      };
      const service2 = await orderCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(service2);
    });

    console.log("Database connect successfully");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Dialz!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
