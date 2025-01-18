const express = require('express');
const morgan = require('morgan');
const restaurantRouter = require("./restaurant.router");
const tableRouter = require("./table.router");
const menuRouter = require("./menu.router");
const edibleRouter = require("./edible.router");

//const orderRouter = require("./order.router");

const api = express.Router();

api.use(morgan(':method :url :status :res[content-length] B - :response-time ms'));

api.use('/restaurants', restaurantRouter);
api.use('/tables', tableRouter);
api.use('/menu', menuRouter);
api.use('/edibles', edibleRouter);
//api.use('/orders', orderRouter);

module.exports = api;