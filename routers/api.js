const express = require('express');
const morgan = require('morgan');
const restaurantRouter = require("./restaurant.router");
const tableRouter = require("./table.router");

const api = express.Router();

api.use(morgan(':method :url :status :res[content-length] B - :response-time ms'));

api.use('/restaurants', restaurantRouter);
api.use('/tables', tableRouter);

module.exports = api;