const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;       //delete r jonno objectId add krte hbe
const password = 'diu123456';


const uri = "mongodb+srv://organicUser:diu123456@cluster0.hcopb.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  // const product = {
  //   name: "modhu",
  //   price: 25,
  //   quantity: 20,
  // }
  // productCollection.insertOne(product)
  // .then(result => {
  //   console.log("one product added");
  // })

  app.get('/products', (req, res) => {
    productCollection.find({}).limit(4)
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      // console.log(documents);
      res.send(documents[0]);
    })
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log("data added successfully");
      res.redirect('/');
    })
  })


  app.patch('/update/:id', (req, res) => {
    console.log(req.body);
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })


  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( (err, result) => {
      res.send(result.deletedCount > 0);
    })
  })
  // client.close();
});


app.listen(3000);