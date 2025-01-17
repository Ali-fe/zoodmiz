
const express = require('express');
const Router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

Router.post('/', restaurantController.addRestaurant);
Router.put('/:restaurantId', restaurantController.updateRestaurant);
Router.delete('/:restaurantId', restaurantController.deleteRestaurant);
Router.get('/:restaurantId', restaurantController.getRestaurantById);
Router.get('/', restaurantController.getRestaurants);

module.exports = Router;