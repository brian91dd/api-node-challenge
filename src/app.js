const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const mongoSanitize = require('express-mongo-sanitize');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });
const routesV1 = require('./routes/v1');
const errorMiddleware = require('./middlewares/error.middleware');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();
const swaggerDocument = require('./swagger.json');

mongoose.connect(process.env.MONGODB_HOST, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use('/v1', authMiddleware.handler, routesV1);
app.use('/*', (req, res) => res.status(404).send('Not Found'));
app.use(errorMiddleware.handler);

module.exports = app;
