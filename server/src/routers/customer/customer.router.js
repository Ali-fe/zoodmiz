
const express = require('express');
const Router = express.Router();
const customerController = require('./customer.controller');
const edibleController = require('../edible/edible.controller');
const authRouter = require('./auth.router');
const { validateResIdParam, validateOrderInput } = require('../../middeldwares/customMiddlewares');
const { authenticateCustomer } = require('../../middeldwares/authMiddleware');
const restaurantController = require('../restaurant/restaurant.controller');
const orderController = require('../order/order.controller');

Router.use('/auth', authRouter)
Router.route('/menu/:restaurantId').get(validateResIdParam,edibleController.getMenu)
Router.route('/restaurants').get(restaurantController.getRestaurants)

Router.route('/orders')
                .get(authenticateCustomer,orderController.getCustomerOrders)
                .post(authenticateCustomer,validateOrderInput,orderController.addCustomerOrder)

Router.route('/user')
        .get(authenticateCustomer,customerController.userInfo)
        .put(authenticateCustomer,customerController.updateUser);   

module.exports = Router;