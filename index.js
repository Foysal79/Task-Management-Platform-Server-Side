const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());




// const uri = "mongodb+srv://<username>:<password>@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority";
 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.haioro2.mongodb.net/?retryWrites=true&w=majority`;




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
      // await client.connect();
      const database = client.db("TaskDB");
   const taskCollection = database.collection("allTask");
   const ComplectTaskCollection = database.collection("ComplectTask");
   const OnGoingTaskCollection = database.collection("OnGoingTask");
   const ToDoTaskCollection = database.collection("ToDoTaskTask");
    // create task
   app.post('/all', async(req, res) => {
    const services = req.body;
    console.log('new services', services);
    const result = await taskCollection.insertOne(services);
    res.send(result);

   })

// email wise to do

   app.get('/toDo', async(req, res) => {
    let query = {};
    if(req.query.email)
    {
      query = {
        
        TaskEmail : req.query.email,
      }
    }
    console.log("query", query);
    const cursor = taskCollection.find(query);
    const results = await cursor.toArray();
    res.send(results);
   })

   app.delete('/users/:id', async(req, res) => {
    const id = req.params.id;
    console.log('database delate id: ', id);
    const query = {_id : new ObjectId(id)}
    const result = await taskCollection.deleteOne(query);
    res.send(result);
})

app.get('/update/:id', async(req, res) => {
  const id = req.params.id;
  const query = { _id : new ObjectId(id) };
  const item = await taskCollection.findOne(query);
  res.send(item);
})

app.put('/update/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id : new ObjectId(id)};
  const options = {upsert: true}
  const updatedItem = req.body;
  const item = {
      $set: {
        Titles : updatedItem.Titles,
        Descriptions : updatedItem.Descriptions,
        Deadlines : updatedItem.Deadlines,
        Priority : updatedItem.Priority,
        email : updatedItem.email,
        Task : updatedItem.Task,
        
          

      }
  }
  const result = await taskCollection.updateOne(filter, item, options);
  res.send(result);
})




   


   


     
    // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('welcome to ST')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})