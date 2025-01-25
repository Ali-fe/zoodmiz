
const express = require('express');
const Router = express.Router();
const restaurantController = require('../restaurant/restaurant.controller');

//Router.get('/', restaurantController.getRestaurantById);
Router.post('/', restaurantController.httpReplaceAllTables);

module.exports = Router;