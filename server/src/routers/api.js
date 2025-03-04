const express = require('express');
const morgan = require('morgan');
const restaurantRouter = require("./restaurant/restaurant.router");
const tableRouter = require("./table/table.router");
const menuRouter = require("./menu/menu.router");
const edibleRouter = require("./edible/edible.router");
const authRouter = require("./auth/auth.router");
//const orderRouter = require("./order.router");

const api = express.Router();

api.use(morgan(':method :url :status :res[content-length] B - :response-time ms'));
//api.use(morgan('dev'));

api.use('/restaurant', restaurantRouter);
api.use('/table', tableRouter);
api.use('/menu', menuRouter);
api.use('/edible', edibleRouter);
api.use('/auth', authRouter);
//api.use('/order', orderRouter);

api.use('*', (req, res) => {
    res.status(200).json({ msg: 'API not found' });
})

module.exports = api;