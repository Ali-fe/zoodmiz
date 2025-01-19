
const express = require('express');
const Router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

Router.get('/', restaurantController.httpGetMenu);
Router.post('/', restaurantController.httpReplaceMenu);

module.exports = Router;