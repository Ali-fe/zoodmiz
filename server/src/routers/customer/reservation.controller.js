const { StatusCodes } = require('http-status-codes');
const Table = require('../../models/table.model');
const Reservation = require('../../models/reservation.model');
const { BadRequestError, NotFoundError } = require('../../errors/customErrors');
const { TABLE_STATUS, RESERVATION_STATUS, NOTIFICATION_CATEGORY, NOTIFICATION_ACTION } = require('../../utils/constants');
const createNotification = require('../../services/notification');
const { persianDateTime, releaseTable } = require('../../services/reservation');

// tables a customer can book, with the slots already taken
const getReservationTables = async (req, res) => {
    const { restaurantId } = req.params;
    const tables = await Table.find({ restaurant: restaurantId }).select('numeral capacity status').sort({ numeral: 1 }).lean();
    const active = await Reservation.find({
        table: { $in: tables.map((table) => table._id) },
        status: { $ne: RESERVATION_STATUS.CANCELLED },
        reserveAt: { $gte: new Date() }
    }).select('table reserveAt').lean();

    const slotsByTable = active.reduce((acc, reservation) => {
        const key = String(reservation.table);
        acc[key] = acc[key] || [];
        acc[key].push(reservation.reserveAt);
        return acc;
    }, {});

    res.status(StatusCodes.OK).json({
        tables: tables.map((table) => ({ ...table, reservedSlots: slotsByTable[String(table._id)] || [] }))
    });
};

const RESERVATION_WINDOW_MS = 2 * 60 * 60 * 1000;

const createReservation = async (req, res) => {
    const { table: numeral, guests, customerName, customerPhone, restaurant, reserveAt } = req.body;
    const table = await Table.findOne({ restaurant, numeral: Number(numeral) });
    if (!table) throw new NotFoundError(`no table by numeral ${numeral}`);
    if (table.status === TABLE_STATUS.OCCUPIED) throw new BadRequestError('این میز در حال حاضر اشغال است');
    if (Number(guests) > table.capacity)
        throw new BadRequestError(`ظرفیت میز ${table.numeral} تعداد ${table.capacity} نفر است`);

    const when = new Date(reserveAt);
    const clash = await Reservation.findOne({
        table: table._id,
        status: { $ne: RESERVATION_STATUS.CANCELLED },
        reserveAt: {
            $gt: new Date(when.getTime() - RESERVATION_WINDOW_MS),
            $lt: new Date(when.getTime() + RESERVATION_WINDOW_MS)
        }
    });
    if (clash) throw new BadRequestError('این میز در بازه زمانی انتخابی رزرو شده است');

    const reservation = await Reservation.create({
        restaurant: table.restaurant,
        table: table._id,
        customerName,
        customerPhone,
        guests: Number(guests),
        reserveAt: when,
        status: RESERVATION_STATUS.PENDING
    });
    await Table.findByIdAndUpdate(table._id, { status: TABLE_STATUS.RESERVED });

    await createNotification({
        restaurant: table.restaurant,
        actorName: customerName,
        category: NOTIFICATION_CATEGORY.TABLE,
        action: NOTIFICATION_ACTION.RESERVE,
        title: 'رزرو میز جدید',
        message: `میز ${table.numeral} برای ${guests} نفر در ${persianDateTime(reservation.reserveAt)} توسط ${customerName} رزرو شد`
    });

    res.status(StatusCodes.CREATED).json({ msg: 'reservation created', reservation });
};

const getMyReservations = async (req, res) => {
    const reservations = await Reservation.find({ customerPhone: req.user.phone })
        .select('-__v')
        .populate('table', 'numeral capacity')
        .populate('restaurant', 'name address.city')
        .sort({ reserveAt: -1 })
        .limit(30);
    res.status(StatusCodes.OK).json({ reservations });
};

const cancelReservation = async (req, res) => {
    const { reservationId } = req.params;
    const reservation = await Reservation.findOne({ _id: reservationId, customerPhone: req.user.phone });
    if (!reservation) throw new NotFoundError('no reservation found for this customer');
    if (reservation.status === RESERVATION_STATUS.CANCELLED)
        throw new BadRequestError('این رزرو قبلاً لغو شده است');

    reservation.status = RESERVATION_STATUS.CANCELLED;
    await reservation.save();
    await releaseTable(reservation.table, reservation._id);

    await createNotification({
        restaurant: reservation.restaurant,
        actorName: reservation.customerName,
        category: NOTIFICATION_CATEGORY.TABLE,
        action: NOTIFICATION_ACTION.UPDATE,
        title: 'رزرو میز لغو شد',
        message: `${reservation.customerName} رزرو میز برای ${persianDateTime(reservation.reserveAt)} را لغو کرد`
    });

    res.status(StatusCodes.OK).json({ msg: 'reservation cancelled', reservation });
};

module.exports = {
    getReservationTables,
    createReservation,
    getMyReservations,
    cancelReservation
};
