const express = require('express');
const Router = express.Router();

const notificationController = require('./notification.controller');

Router.route('/')
    .get(notificationController.getNotifications);

Router.route('/read-all')
    .patch(notificationController.markAllNotificationsRead);

Router.route('/:notificationId/read')
    .patch(notificationController.markNotificationRead);

module.exports = Router;
