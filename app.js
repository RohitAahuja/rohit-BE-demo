const express = require('express');

// const bodyParser = require('body-parser');

const app = express();

const customerRoutes = require('./routes/customer');

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://Rohit:rohit@cluster0.tikak.mongodb.net/rohit?retryWrites=true&w=majority';
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/customer', customerRoutes);


app.use((error, req, res, next) => {
   console.log(error);
})

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(c => {
        app.listen(8080);
    })
    .catch(err => console.log(err));