
const express = require('express');
const Router = express.Router();

const customerController = require('./customer.controller');
const { validateCustomerPhone, validateCustomer, validateOtpCode } = require('../../middeldwares/customMiddlewares');

Router.post('/request-otp', validateCustomerPhone, customerController.requestOtp);
Router.post('/verify-otp', validateCustomer, validateOtpCode, customerController.login);
Router.get('/logout', customerController.logout);

module.exports = Router;