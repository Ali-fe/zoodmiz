
const express = require('express');
const Router = express.Router();
const restaurantController = require('./restaurant.controller');
const { /*validateResIdParam,*/ validateRestaurantInput, validateTableInput, validateTableIdParam } = require('../../middeldwares/customMiddlewares');


Router.route('/')
    .get(restaurantController.getRestaurant)
    .patch(validateRestaurantInput, restaurantController.updateRestaurant)
    .delete(restaurantController.deleteRestaurant);

Router.route('/tables').post(validateTableInput, restaurantController.addTable)
Router.route('/tables/:tableId')
    .patch(validateTableIdParam, validateTableInput, restaurantController.updateTable)
    .delete(validateTableIdParam, restaurantController.deleteTable);

//.delete(validateTableIdParam, restaurantController.deleteTable)*/

/*Router.route('/menu')
    .get(restaurantController.httpGetMenu)
    .post(restaurantController.httpReplaceMenu);*/


//Router.route('/all').get(restaurantController.getAllRestaurant);

// Router.route('/:id')
//     .get(validateResIdParam, restaurantController.httpGetRestaurant)
//     .put(validateResIdParam, validateRestaurantInput, restaurantController.httpUpdateRestaurant)
//     .delete(validateResIdParam, restaurantController.httpDeleteRestaurant);

module.exports = Router;