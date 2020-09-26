const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const uri =
  'mongodb+srv://elghannay:0666565422@cluster0.hqtdu.azure.mongodb.net/shop?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
  const collection = client.db('shop').collection('products');
  // perform actions on the collection object
  console.log('connected successfully');
  client.close();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

app.listen(3100);
