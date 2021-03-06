const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const cors = require('cors');
const { ObjectId } = require('mongodb');
app.use(cors());
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.giumd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.get('/', (req, res) => {
    res.send('hello i am working')
})


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const ProductCollection = client.db("VolunteerData").collection("initative");
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    ProductCollection.insertOne(product)
    .then((result) =>{
      res.send(result.insertedCount > 0)
    })
  })
 
  app.get('/appoiontment', (req, res)=>{
    ProductCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })
  app.delete('/delete/:id', (req, res)=>{
    ProductCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    
  })
 
  // ProductCollection.deleteMany({})
  //   .then(result=>{
  //     res.send(result.insertedCount>0)
  //   })
  
});


app.listen(process.env.PORT || port);