
const express = require('express');
const Router = express.Router();

const userController = require('./user.controller');
const { validateUpdateUserInput } = require('../../middeldwares/customMiddlewares');
const { authorizePermision } = require('../../middeldwares/authMiddleware');

Router.get('/current-user', userController.httpCurrentUser);
Router.get('/admin/app-stats', [
    authorizePermision('admin'),
    userController.httpApplicationStats]);
Router.patch('/update-user', validateUpdateUserInput, userController.httpUpdateUser);

module.exports = Router;