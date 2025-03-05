
const express = require('express');
const Router = express.Router();
const restaurantController = require('../restaurant/restaurant.controller');


Router.route('/').get(restaurantController.httpGetMenu).post(restaurantController.httpReplaceMenu);

module.exports = Router;