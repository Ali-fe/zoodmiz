
const express = require('express');
const Router = express.Router();
const edibleController = require('./edible.controller');
const { validateEdibleInput, validateEdibleIdParam } = require('../../middeldwares/customMiddlewares');

Router.route('/')
    .get(edibleController.getEdibles)
    .post(validateEdibleInput, edibleController.addEdible);

Router.route('/:edibleId')
    .patch(validateEdibleIdParam, edibleController.updateEdible)
    .delete(validateEdibleIdParam, edibleController.deleteEdible)


module.exports = Router;