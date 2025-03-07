
const express = require('express');
const Router = express.Router();

const authController = require('./auth.controller');
const { validateRegisterInput, validateLoginInput } = require('../../middeldwares/customMiddlewares');

Router.post('/register', validateRegisterInput, authController.httpRegister);
Router.post('/login', validateLoginInput, authController.httpLogin);
Router.get('/logout', authController.httpLogout);

module.exports = Router;