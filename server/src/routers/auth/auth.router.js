
const express = require('express');
const Router = express.Router();
const userController = require('./auth.controller');

Router.post('/register', userController.httpRegister);
Router.post('/login', userController.httpLogin);

/*
Router.put('/:userId', userController.updateUser);
Router.delete('/:userId', userController.deleteUser);
Router.get('/:userId', userController.getUser);
*/

module.exports = Router;