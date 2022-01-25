const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());


// name mydbuser1 
// password jXysspZBFr9XDuL4

const uri = "mongodb+srv://mydbuser1:jXysspZBFr9XDuL4@cluster0.bmyfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const usersCollection = database.collection("users");

    // GET API
    app.get('/users',async(req,res)=>{
      const cursor=usersCollection.find({});
      const users=await cursor.toArray();
      res.send(users);
    })

    // Get Id
    app.get('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const query = { _id: ObjectId(id) };
      const user=await usersCollection.findOne(query);
      console.log('load user with id',id);
      res.send(user);
    })

    // POST API
    app.post('/users',async(req,res)=>{
      const newUser=req.body;
      const result=await usersCollection.insertOne(newUser);
      console.log('got new user',req.body);
      console.log('added user', result);
      res.json(result);
    })

    // Update API
    app.put('/users/:id',async(req,res)=>{
     id=(req.params.id);
     const updatedUser=req.body;
     const filter={_id:ObjectId(id)};
     const options={upsert:true};
     const updateDoc={
       $set: {
        name: updatedUser.name,
        email: updatedUser.email
       }
     };
     const result=await usersCollection.updateOne(filter,updateDoc,options)
      console.log('updating user',id);
      res.json(result);
    })

    // DELETE API
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);

      console.log('deleting user with id ', result);
      res.json(result);
  })

    // // create a document to insert
    // const doc = {
    //   name: "ghudu",
    //   email: "ghudu@gmail.com",
    // }
    // const result = await usersCollection.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   // perform actions on the collection object
//   console.log('hitting the database');
//   const user={name:"vokku jamal", email:"jamal@gmail.com", phone:"01785675348"}
//   collection.insertOne(user)
//   .then(()=>{
//     console.log('insert success');
//   })
//   // client.close();
// });

app.get('/', (req, res) => {
  res.send('Running My Crud Server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})