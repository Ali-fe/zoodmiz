
const express = require('express');
const Router = express.Router();
const edibleController = require('../controllers/edible.controller');

Router.get('/', edibleController.httpGetEdibles);
Router.post('/', edibleController.httpAddEdible);
/*Router.put('/:edibleId', edibleController.httpUpdateEdible);
Router.delete('/:edibleId', edibleController.httpDeleteEdible);
Router.get('/:edibleId', edibleController.httpGetEdibleById);*/


module.exports = Router;