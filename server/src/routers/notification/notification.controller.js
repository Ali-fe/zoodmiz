const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Notification = require('../../models/notification.model');
const { BadRequestError, NotFoundError } = require('../../errors/customErrors');

const getNotifications = async (req, res) => {
    const { restaurantId } = req.user;
    const limit = Math.min(Math.abs(Number(req.query.limit)) || 50, 100);
    const [notifications, unreadCount] = await Promise.all([
        Notification.find({ restaurant: restaurantId })
            .sort({ createdAt: -1 })
            .limit(limit),
        Notification.countDocuments({ restaurant: restaurantId, isRead: false })
    ]);
    res.status(StatusCodes.OK).json({ notifications, unreadCount });
};

const markNotificationRead = async (req, res) => {
    const { restaurantId } = req.user;
    const { notificationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(notificationId))
        throw new BadRequestError('invalid mongodb id');

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, restaurant: restaurantId },
        { isRead: true },
        { new: true }
    );
    if (!notification) throw new NotFoundError(`no notification by id ${notificationId}`);

    res.status(StatusCodes.OK).json({
        msg: 'notification marked as read',
        notification
    });
};

const markAllNotificationsRead = async (req, res) => {
    const { restaurantId } = req.user;
    await Notification.updateMany(
        { restaurant: restaurantId, isRead: false },
        { isRead: true }
    );
    res.status(StatusCodes.OK).json({ msg: 'all notifications marked as read' });
};

module.exports = {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
};
