
const express = require('express');
const Router = express.Router();

const userController = require('./auth.controller');
const { validateRegisterInput,validateLoginInput } = require('../../middeldwares/customMiddlewares');

Router.post('/register', validateRegisterInput, userController.httpRegister);
Router.post('/login',validateLoginInput, userController.httpLogin);

/*
Router.put('/:userId', userController.updateUser);
Router.delete('/:userId', userController.deleteUser);
Router.get('/:userId', userController.getUser);
*/

module.exports = Router;