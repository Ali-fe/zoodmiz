
const express = require('express');
const Router = express.Router();
const edibleController = require('./edible.controller');

Router.get('/', edibleController.httpGetEdibles);
Router.post('/', edibleController.httpAddEdible);
Router.delete('/:edibleId', edibleController.httpDeleteEdible);
Router.put('/:edibleId', edibleController.httpUpdateEdible);

module.exports = Router;