require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

// adding cors permission and middleware
app.use(cors());
app.use(express.json());

// db details
// dbAuthor=muhammadjiku
// dbPassword=TDxs8uTiUf1Kujme
const uri =
  'mongodb+srv://muhammadjiku:TDxs8uTiUf1Kujme@cluster0.24qh6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    const championsCollection = client.db('foodExpress').collection('champion');

    // displaying champions data
    app.get('/champion', async (req, res) => {
      const query = {};
      const cursor = championsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // displaying single data from database
    app.get('/champion/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await championsCollection.findOne(query);
      res.send(result);
    });

    // creating champion data
    app.post('/champion', async (req, res) => {
      const newChamp = req.body;
      console.log('Champ is here', newChamp);
      const result = await championsCollection.insertOne(newChamp);
      res.send(result);
    });

    // updating champion data
    app.put('/champion/:id', async (req, res) => {
      const id = req.params.id;
      const updateChamp = req.body;
      const filter = { _id: objectId(id) };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: {
          name: updateChamp.name,
          email: updateChamp.email,
        },
      };
      const result = await championsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // deleting champion data
    app.delete('/champion/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await championsCollection.deleteOne(query);
      res.send(result);
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
      } else {
        console.log('No documents matched the query. Deleted 0 documents.');
      }
    });

    // const result = await championsCollection.insertOne(champion);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch (error) {
    console.log(error);
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello there!!');
});

app.listen(port, (req, res) => {
  console.log(`Server running at http://localhost:${port}`);
});
