require('express-async-errors');
const express = require("express");
const api = require("./routers/api");
const path = require("path");
const morgan = require('morgan');
const { errorHandlerMiddleware } = require('./middeldwares/customMiddlewares');
//const { NotFoundError } = require('./errors/customErrors');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api', api);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(errorHandlerMiddleware);

module.exports = app;