const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://jakareya1306:${process.env.DB_PASS}@cluster0.igkd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("product-find");
    const productsCollection = database.collection("products");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const searchQuery = req.query.search || "";

      const query = searchQuery
        ? { productName: { $regex: searchQuery, $options: "i" } }
        : {};

      const totalProducts = await productsCollection.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);

      const products = await productsCollection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

      res.send({
        products,
        totalPages,
        currentPage: page,
      });
    });

    app.post("/products", async (req, res) => {
      const data = req.body;

      console.log(res);

      res.send("hello");
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(PORT);
