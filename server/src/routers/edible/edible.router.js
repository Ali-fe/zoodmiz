
const express = require('express');
const Router = express.Router();
const edibleController = require('./edible.controller');

Router.route('/').get(edibleController.httpGetEdibles).post(edibleController.httpAddEdible);
Router.route('/:edibleId').delete(edibleController.httpDeleteEdible).put(edibleController.httpUpdateEdible);

module.exports = Router;