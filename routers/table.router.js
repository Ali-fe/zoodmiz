
const express = require('express');
const Router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

//Router.get('/', restaurantController.getRestaurantById);
Router.post('/', restaurantController.replaceAllTables);

module.exports = Router;