
const express = require('express');
const Router = express.Router();
const restaurantController = require('./restaurant.controller');
const { /*validateResIdParam,*/ validateRestaurantInput } = require('../../middeldwares/customMiddlewares');


Router.route('/')
    .get(restaurantController.getRestaurant)
    .patch(validateRestaurantInput, restaurantController.updateRestaurant)
    .delete(restaurantController.deleteRestaurant);

/*Router.route('/menu')
    .get(restaurantController.httpGetMenu)
    .post(restaurantController.httpReplaceMenu);*/
//Router.route('/tables').patch(restaurantController.replace)

//Router.route('/all').get(restaurantController.getAllRestaurant);

// Router.route('/:id')
//     .get(validateResIdParam, restaurantController.httpGetRestaurant)
//     .put(validateResIdParam, validateRestaurantInput, restaurantController.httpUpdateRestaurant)
//     .delete(validateResIdParam, restaurantController.httpDeleteRestaurant);

module.exports = Router;