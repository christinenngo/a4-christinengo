require('dotenv').config();
const apiKey = process.env.API_KEY;
const databaseUrl = process.env.DATABASE_URL;

const express = require( 'express' ),
    app = express()
    //appdata = []

app.use( express.static( 'public' ) )
app.use( express.json())

const calculateProgress = function ( watched, total ) {
  const p = Math.floor((watched / total) * 100);
  if (p > 100) {
    return "100%";
  } else if (p >= 0) {
    return p + "%";
  } else {
    return "0%";
  }
}

const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null;

async function run() {
  try {
    await client.connect();

    collection = client.db("myDatabase").collection("myCollection");
    await client.db("myDatabase").command({ ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.log("err :", err);
    await client.close();
  }
}

app.use( (req, res, next) => {
  if (collection !== null) {
    next()
  } else {
    res.status(503).send()
  }
})

app.get("/results", async (req, res) => {
  if (collection !== null) {
    const docs = await collection.find({}).toArray()
    res.json(docs)
  }
})

app.post('/submit', async (req, res) => {
  const data = req.body;
  data.progress = calculateProgress(data.watched, data.episodes);
  const result = await collection.insertOne(data)
  res.json(result)
})

app.post('/delete', async (req, res) => {
  if(req?.body?._id) {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.body._id)
    })
    res.json(result)
  } else {
    console.log("Id not found.")
    res.status(500).send();
  }
})

app.post('/update', async (req, res) => {
  if(req?.body?._id) {
    const data = {[req.body.field]: req.body.newInfo, watched: req.body.watched, episodes: req.body.episodes};
    data.progress = calculateProgress(data.watched, data.episodes);

    const result = await collection.updateOne(
        { _id: new ObjectId(req.body._id)},
        { $set: data},
    )
    res.json(result)
  } else {
    console.log("Id not found.")
    res.status(500).send();
  }
})

run().catch(console.dir);

app.listen( process.env.PORT || 3000 )