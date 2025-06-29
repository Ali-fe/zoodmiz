const express = require('express');
const morgan = require('morgan');
const restaurantRouter = require("./restaurant/restaurant.router");
const edibleRouter = require("./edible/edible.router");
const authRouter = require("./auth/auth.router");
const userRouter = require('./user/user.router');
const customerRouter = require("./customer/customer.router");
const orderRouter = require("./order/order.router");

const { authenticateUser } = require('../middeldwares/authMiddleware');


const api = express.Router();

api.use(morgan(':method :url :status :res[content-length] B - :response-time ms'));
//api.use(morgan('dev'));

api.use('/auth', authRouter);
api.use('/customer', customerRouter);
api.use('/restaurants', authenticateUser, restaurantRouter);
api.use('/edibles', authenticateUser, edibleRouter);
api.use('/users', authenticateUser, userRouter);
api.use('/orders',authenticateUser, orderRouter);

api.get('/test', (req, res) => {
    res.status(200).json({ msg: 'test api response' });
});

api.use('*', (req, res) => {
    res.status(404).json({ msg: 'API not found' });
})

module.exports = api;