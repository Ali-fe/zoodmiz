
const express = require('express');
const Router = express.Router();
const restaurantController = require('../restaurant/restaurant.controller');
const { validateResIdParam } = require('../../middeldwares/customMiddlewares');


Router.route('/menu/:restaurantId').get(validateResIdParam,restaurantController.getMenu)
//Router.route('/login').post();
// var Kavenegar = require('kavenegar');
// var api = Kavenegar.KavenegarApi({apikey: '39394C5456654941385542526D497645625549624347766B5A394762752F62387948794E6C316A774263673D'});
// api.Send({ message: "سلام" , sender: "2000660110" , receptor: "09187114282" });
module.exports = Router;