
const express = require('express');
const Router = express.Router();
const restaurantController = require('./restaurant.controller');

Router.route('/').get(restaurantController.httpGetRestaurants)
                 .post( restaurantController.httpAddRestaurant);

Router.route('/:restaurantId').put(restaurantController.httpUpdateRestaurant)
                              .delete(restaurantController.httpDeleteRestaurant)
                              .get(restaurantController.httpGetRestaurantById);

module.exports = Router;