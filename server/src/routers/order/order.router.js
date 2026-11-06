
const express = require('express');
const Router = express.Router();
const orderController = require('./order.controller');
const { validateOrderInput, validateOrderIdParam } = require('../../middeldwares/customMiddlewares');

Router.route('/')
    .get(orderController.getOrders)
    .post(validateOrderInput, orderController.addRestaurantOrder);

Router.route('/:orderId')
    .get(validateOrderIdParam, orderController.getOrder)
    .patch(validateOrderIdParam, validateOrderInput, orderController.updateOrder)
    .delete(validateOrderIdParam, orderController.deleteOrder)
    
module.exports = Router;