
const express = require('express');
const Router = express.Router();
const restaurantController = require('./restaurant.controller');
const { validateIdParam } = require('../../middeldwares/customMiddlewares');

Router.route('/:id').get(validateIdParam,restaurantController.httpGetRestaurant)
                    .put(validateIdParam,restaurantController.httpUpdateRestaurant)
                    .delete(validateIdParam,restaurantController.httpDeleteRestaurant);

Router.route('/').post( restaurantController.httpAddRestaurant);       

module.exports = Router;