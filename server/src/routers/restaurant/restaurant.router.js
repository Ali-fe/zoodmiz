
const express = require('express');
const Router = express.Router();
const restaurantController = require('./restaurant.controller');
const { /*validateResIdParam,*/
    validateRestaurantInput,
    validateTableInput,
    validateTableIdParam,
    validateMenuItemInput,
    validateMenuItemIdParam,
    validateUpdateMenuItemInput
} = require('../../middeldwares/customMiddlewares');


Router.route('/')
    .get(restaurantController.getRestaurant)
    .patch(validateRestaurantInput, restaurantController.updateRestaurant)
    .delete(restaurantController.deleteRestaurant);

Router.route('/tables').post(validateTableInput, restaurantController.addTable)
Router.route('/tables/:tableId')
    .patch(validateTableIdParam, validateTableInput, restaurantController.updateTable)
    .delete(validateTableIdParam, restaurantController.deleteTable);

Router.route('/menu').post(validateMenuItemInput, restaurantController.addMenuItem)
Router.route('/menu/:menuItemId')
    .patch(validateMenuItemIdParam, validateUpdateMenuItemInput, restaurantController.updateMenuItem)
    .delete(validateMenuItemIdParam, restaurantController.deleteMenuItem);


//Router.route('/all').get(restaurantController.getAllRestaurant);

// Router.route('/:id')
//     .get(validateResIdParam, restaurantController.httpGetRestaurant)
//     .put(validateResIdParam, validateRestaurantInput, restaurantController.httpUpdateRestaurant)
//     .delete(validateResIdParam, restaurantController.httpDeleteRestaurant);

module.exports = Router;