
const express = require('express');
const Router = express.Router();
const edibleController = require('./edible.controller');
const { validateEdibleInput, validateEdibleIdParam } = require('../../middeldwares/customMiddlewares');

Router.route('/images')
    .get(edibleController.getImages)
    
Router.route('/images/:encoddedpath')
    .delete(edibleController.deleteImages);

Router.route('/')
    .get(edibleController.getEdibles)
    .post(validateEdibleInput, edibleController.addEdible);

Router.route('/:edibleId')
    .get(validateEdibleIdParam,edibleController.getEdible)
    .patch(validateEdibleIdParam, edibleController.updateEdible)
    .delete(validateEdibleIdParam, edibleController.deleteEdible)
    
Router.route('/upload')
    .post(edibleController.upload.single('image'), edibleController.uploadImage)



module.exports = Router;