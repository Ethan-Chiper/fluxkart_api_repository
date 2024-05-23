const express = require('express');
const bodyParser = require('body-parser');
const identifyRoute = require('./routes/identify');

const app = express();

app.use(bodyParser.json());
app.use('/api', identifyRoute);

module.exports = app;
