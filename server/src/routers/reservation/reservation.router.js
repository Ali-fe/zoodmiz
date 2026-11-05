const express = require('express');
const Router = express.Router();
const reservationController = require('./reservation.controller');
const {
    validateReservationIdParam,
    validateReservationStatusInput
} = require('../../middeldwares/customMiddlewares');

Router.route('/')
    .get(reservationController.getReservations);

Router.route('/:reservationId')
    .patch(validateReservationIdParam, validateReservationStatusInput, reservationController.updateReservationStatus);

module.exports = Router;
