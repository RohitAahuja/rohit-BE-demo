const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const customerRoutes = require('./routes/customer');
// const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use('/customer', customerRoutes);

app.listen(8080);
// mongoose.connect()
//     .then(connection => app.listen(8080))
//     .catch()