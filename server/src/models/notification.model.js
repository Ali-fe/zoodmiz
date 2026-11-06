const mongoose = require('mongoose');
const { NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../utils/constants');

const NotificationSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    category: {
        type: String,
        enum: Object.values(NOTIFICATION_CATEGORY),
        required: true
    },
    action: {
        type: String,
        enum: Object.values(NOTIFICATION_ACTION),
        default: NOTIFICATION_ACTION.CREATE
    },
    // kept so notifications saved before categories were introduced stay readable
    type: { type: String },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorName: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ restaurant: 1, createdAt: -1 });
NotificationSchema.index({ restaurant: 1, isRead: 1 });
NotificationSchema.index({ restaurant: 1, category: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
