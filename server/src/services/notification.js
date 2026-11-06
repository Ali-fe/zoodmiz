const Notification = require('../models/notification.model');
const User = require('../models/user.model');

const fullName = (user) => `${user.name} ${user.lastName || ''}`.trim();

// Notification failures must never break the main operation
const createNotification = async ({
    restaurant,
    category,
    action,
    title,
    message,
    actorId,
    actorName
}) => {
    try {
        let name = actorName;
        if (!name && actorId) {
            const user = await User.findById(actorId, 'name lastName');
            if (user) name = fullName(user);
        }
        await Notification.create({
            restaurant,
            category,
            action,
            title,
            message,
            actor: actorId || undefined,
            actorName: name || ''
        });
    } catch (err) {
        console.error('failed to create notification', err);
    }
};

module.exports = createNotification;
