
const express = require('express');
const Router = express.Router();
const edibleController = require('./edible.controller');

Router.route('/')
    .get(edibleController.getEdibles)
    .post(edibleController.addEdible);

Router.route('/:id')
    .delete(edibleController.deleteEdible)
    .patch(edibleController.updateEdible);

module.exports = Router;