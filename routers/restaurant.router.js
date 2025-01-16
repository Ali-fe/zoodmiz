
const express = require('express');
const restaurantRouter = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

// Route to get all restaurants
restaurantRouter.get('/', restaurantController.getAllRestaurants);

// Route to add a new restaurant
restaurantRouter.post('/', restaurantController.addRestaurant);

// Route to update an existing restaurant
restaurantRouter.put('/:restaurantId', restaurantController.updateRestaurant);

// Route to delete a restaurant
restaurantRouter.delete('/:restaurantId', restaurantController.deleteRestaurant);

// Route to get a restaurant by ID
restaurantRouter.get('/:restaurantId', restaurantController.getRestaurantById);

module.exports = restaurantRouter;