
const express = require('express');
const Router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

Router.get('/', restaurantController.httpGetRestaurants);
Router.post('/', restaurantController.httpAddRestaurant);
Router.put('/:restaurantId', restaurantController.httpUpdateRestaurant);
Router.delete('/:restaurantId', restaurantController.httpDeleteRestaurant);
Router.get('/:restaurantId', restaurantController.httpGetRestaurantById);


module.exports = Router;