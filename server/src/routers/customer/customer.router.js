
const express = require('express');
const Router = express.Router();
const customerController = require('./customer.controller');
const edibleController = require('../edible/edible.controller');
const authRouter = require('./auth.router');
const { validateResIdParam } = require('../../middeldwares/customMiddlewares');
const { authenticateCustomer } = require('../../middeldwares/authMiddleware');

Router.use('/auth', authRouter)
Router.route('/menu/:restaurantId').get(validateResIdParam,edibleController.getMenu)
Router.route('/user')
        .get(authenticateCustomer,customerController.userInfo)
        .put(authenticateCustomer,customerController.updateUser);   

module.exports = Router;