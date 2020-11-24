const path = require('path')
const dotenv = require('dotenv')
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({path: path.resolve(__dirname, `../${envFile}`)});
const express = require('express');
const routesV1 = require('./routes/v1');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middlewares/error.middleware');
const app = express();

mongoose.connect(process.env.MONGODB_HOST, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use('/v1', routesV1);
app.use('/*', (req, res) => res.status(404).send("Not Found"));
app.use(errorMiddleware.handler);

module.exports = app;