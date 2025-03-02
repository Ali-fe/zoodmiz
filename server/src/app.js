require('express-async-errors');
const express = require("express");
const api = require("./routers/api");
const path = require("path");
const morgan = require ('morgan');
const { errorHandlerMiddleware  } = require('./middeldwares/customMiddlewares');
//const { NotFoundError } = require('./errors/customErrors');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
app.use('/api', api);
app.use(errorHandlerMiddleware);

module.exports = app;