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

module.exports = { persianDateTime, releaseTable };
