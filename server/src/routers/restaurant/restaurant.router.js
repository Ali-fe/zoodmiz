
const express = require('express');
const Router = express.Router();
const restaurantController = require('./restaurant.controller');
const { validateResIdParam, validateRestaurantBody } = require('../../middeldwares/customMiddlewares');

Router.route('/:id')
    .get(validateResIdParam, restaurantController.httpGetRestaurant)
    .put(validateResIdParam, validateRestaurantBody, restaurantController.httpUpdateRestaurant)
    .delete(validateResIdParam, restaurantController.httpDeleteRestaurant);

Router.route('/')
    .get(restaurantController.httpGetUserRestaurant)
    .put(validateRestaurantBody, restaurantController.httpUpdateUserRestaurant)
    .delete(restaurantController.httpDeleteUserRestaurant);

// Router.route('/').get(restaurantController.httpGetRestaurants)
//     .post(restaurantController.httpAddRestaurant);

module.exports = Router;