const { StatusCodes } = require('http-status-codes');
const Reservation = require('../../models/reservation.model');
const { NotFoundError } = require('../../errors/customErrors');
const { RESERVATION_STATUS, NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../../utils/constants');
const createNotification = require('../../services/notification');
const { persianDateTime, releaseTable } = require('../../services/reservation');

const getReservations = async (req, res) => {
    const { restaurantId } = req.user;
    const reservations = await Reservation.find({
        restaurant: restaurantId,
        status: { $ne: RESERVATION_STATUS.CANCELLED }
    })
        .populate('table', 'numeral capacity')
        .sort({ reserveAt: 1 })
        .limit(100);
    res.status(StatusCodes.OK).json({ reservations });
};

const updateReservationStatus = async (req, res) => {
    const { restaurantId } = req.user;
    const { reservationId } = req.params;
    const reservation = await Reservation.findOne({ _id: reservationId, restaurant: restaurantId });
    if (!reservation) throw new NotFoundError(`no reservation by id ${reservationId}`);

    const { status } = req.body;
    reservation.status = status;
    await reservation.save();

    let releasedTable = null;
    if (status === RESERVATION_STATUS.CANCELLED) releasedTable = await releaseTable(reservation.table, reservation._id);

    await createNotification({
        restaurant: restaurantId,
        actorId: req.user.userId,
        category: NOTIFICATION_CATEGORY.TABLE,
        action: status === RESERVATION_STATUS.CANCELLED ? NOTIFICATION_ACTION.UPDATE : NOTIFICATION_ACTION.RESERVE,
        title: status === RESERVATION_STATUS.CANCELLED ? 'رزرو میز رد شد' : 'رزرو میز تایید شد',
        message: `رزرو ${reservation.customerName} برای ${persianDateTime(reservation.reserveAt)} ${status === RESERVATION_STATUS.CANCELLED ? 'رد شد' : 'تایید شد'}`
    });

    res.status(StatusCodes.OK).json({
        msg: 'reservation updated',
        reservation,
        tableFreed: !releasedTable
    });
};

module.exports = {
    getReservations,
    updateReservationStatus
};
