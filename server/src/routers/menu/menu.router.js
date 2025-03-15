
const express = require('express');
const Router = express.Router();
const restaurantController = require('../restaurant/restaurant.controller');
const { validateResIdParam } = require('../../middeldwares/customMiddlewares');


Router.route('/:restaurantId').get(validateResIdParam,restaurantController.getMenu)
//.post(restaurantController.httpReplaceMenu);

module.exports = Router;