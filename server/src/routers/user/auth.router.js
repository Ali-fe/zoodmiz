
const express = require('express');
const Router = express.Router();
const userController = require('./auth.controller');

Router.post('/login', userController.login);
Router.post('/register', userController.register);

/*
Router.put('/:userId', userController.httpUpdateUser);
Router.delete('/:userId', userController.httpDeleteUser);
Router.get('/:userId', userController.httpGetUserById);
*/

module.exports = Router;