const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../utils/constants');

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    rating: { type: Number, default: 0 },
    comment: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    tableNumber: { type: Number, required: true },
    status: {
        type: Number,
        enum: Object.values(ORDER_STATUS),
        required: true,
        default: ORDER_STATUS.PENDING
    },
    customerName: { type: String },
    customerPhone: { type: String },
    totalPrice: { type: Number, required: true, default: 0 },
    orderTime: { type: Date, default: Date.now },
    items: [
        {
            EdibleName: { type: String, required: true },
            Price: { type: Number, required: true },
            Quantity: { type: Number, required: true, default: 1 }
        }
    ],
    feedback: { type: [FeedbackSchema], default: [] }
});

// index
OrderSchema.index({ restaurant: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderTime: -1 });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
