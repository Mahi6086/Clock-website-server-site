const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();

/* Fppk4W4uhOGaUelg
niche12
*/

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfmbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
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
    const usersCollection = database.collection("users");
    const ratingCollection = database.collection("rating");

    // GET API
    // GET API
    app.get("/services", async (req, res) => {
      const cursors = servicesCollection.find({});
      const result = await cursors.toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    //POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      // console.log(result);
      res.json(result);
    });

    //Rating POST
    app.post("/rating", async (req, res) => {
      const rating = req.body;
      const result = await ratingCollection.insertOne(rating);

      res.json(result);
    });
    //Rating GET
    app.get("/rating", async (req, res) => {
      const cursor = ratingCollection.find({});
      const result = await cursor.toArray();
      // const result = await ratingCollection.find(rating);

      res.send(result);
    });

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //GET API for users
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await usersCollection.findOne(query);
      let isAdmin = false;
      if (users?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //POST API for users
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.json(result);
    });

    //UPSERT API for users
    app.put("/users/admin", async (req, res) => {
      const users = req.body;
      const filter = { email: users.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put("/users", async (req, res) => {
      const users = req.body;
      const filter = { email: users.email };
      const options = { upsert: true };
      const updateDoc = { $set: users };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
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
    /* app.get("/manageProducts", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    }); */
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
