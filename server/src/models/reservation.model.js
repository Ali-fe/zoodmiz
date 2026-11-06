const mongoose = require('mongoose');
const { RESERVATION_STATUS } = require('../utils/constants');

const ReservationSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    guests: { type: Number, required: true, default: 2 },
    reserveAt: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(RESERVATION_STATUS),
        default: RESERVATION_STATUS.PENDING
    },
    createdAt: { type: Date, default: Date.now }
});

ReservationSchema.index({ restaurant: 1, status: 1, reserveAt: 1 });
ReservationSchema.index({ customerPhone: 1 });

const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;
