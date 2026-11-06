const Table = require('../models/table.model');
const Reservation = require('../models/reservation.model');
const { TABLE_STATUS, RESERVATION_STATUS } = require('../utils/constants');

const persianDateTime = (date) =>
    new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));

// a table only goes back to available once nothing else is booked for it
const releaseTable = async (tableId, exceptReservationId) => {
    const next = await Reservation.findOne({
        table: tableId,
        status: { $ne: RESERVATION_STATUS.CANCELLED },
        reserveAt: { $gte: new Date() },
        _id: { $ne: exceptReservationId }
    }).sort({ reserveAt: 1 });
    if (!next) await Table.findByIdAndUpdate(tableId, { status: TABLE_STATUS.AVAILABLE });
    return next;
};

// a booked table only stays reserved until its visit time passes; nothing schedules this,
// so the dashboard list refresh is what frees tables whose reservation has gone stale
const releaseExpiredTables = async (restaurantId) => {
    const reserved = await Table.find({ restaurant: restaurantId, status: TABLE_STATUS.RESERVED })
        .select('_id')
        .lean();
    const now = new Date();
    await Promise.all(reserved.map(async (table) => {
        const upcoming = await Reservation.countDocuments({
            table: table._id,
            status: { $ne: RESERVATION_STATUS.CANCELLED },
            reserveAt: { $gte: now }
        });
        if (!upcoming) await Table.findByIdAndUpdate(table._id, { status: TABLE_STATUS.AVAILABLE });
    }));
};

module.exports = { persianDateTime, releaseTable, releaseExpiredTables };
