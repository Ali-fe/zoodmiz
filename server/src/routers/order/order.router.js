
const express = require('express');
const Router = express.Router();
const orderController = require('./order.controller');
const { validateOrderInput, validateOrderIdParam } = require('../../middeldwares/customMiddlewares');

Router.route('/')
    .get(orderController.getOrders)
    .post(validateOrderInput, orderController.addRestaurantOrder);

Router.route('/:orderId',validateOrderIdParam)
    .get(orderController.getOrder)
    .patch(validateOrderInput, orderController.updateOrder)
    .delete(orderController.deleteOrder)
    
module.exports = Router;