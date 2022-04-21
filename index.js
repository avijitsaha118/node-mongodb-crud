const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { request } = require('express');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user : dbuser1
// password: kOoG44KSOmWXdrtI



const uri = "mongodb+srv://dbuser1:kOoG44KSOmWXdrtI@cluster0.etjy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db("foodExpress").collection("users");
        
        //get users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        //POST user : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        });

        //update (put method) user

        app.put('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options ={upsert: true};
            const updatedDoc ={
                $set:{
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
const result = await userCollection.updateOne(filter, updatedDoc, options);
res.send(result);

        })

        //delete a user
        app.delete('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })


        //   const user ={name: 'ms dhoni', email:'ms@ymail.com'};
        const result = await userCollection.insertOne(user);
        console.log(`user inserted with id: ${result.insertedId}`)
    }
    finally {
        //  await client.close();
    }
}
console.log('')
run().catch(console.dir)




// client.connect(err => {
//   const collection = client.db("foodExpress").collection("users");
//   console.log('db connected');
//   // perform actions on the collection object
//   client.close();
// });


app.get('/', (req, res) => {
    res.send('running my node CRUD server');
});

app.listen(port, () => {
    console.log('CRUD server is running');
})