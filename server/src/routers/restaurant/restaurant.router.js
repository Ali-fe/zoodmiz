const express = require("express");
const Router = express.Router();
const restaurantController = require("./restaurant.controller");
const {
  /*validateResIdParam,*/ validateRestaurantInput,
  validateTableInput,
  validateTableIdParam,
} = require("../../middeldwares/customMiddlewares");

Router.route("/")
  .get(restaurantController.getRestaurant)
  .patch(validateRestaurantInput, restaurantController.updateRestaurant)
  .delete(restaurantController.deleteRestaurant);

Router.route("/tables")
  .get(restaurantController.getTables)
  .post(validateTableInput, restaurantController.addTable);
  
Router.route("/tables/:tableId")
  .patch(
    validateTableIdParam,
    validateTableInput,
    restaurantController.updateTable
  )
  .delete(validateTableIdParam, restaurantController.deleteTable);


module.exports = Router;
