const mongoose = require('mongoose');

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    Rating: { type: Number, default: 0 },
    Comment: { type: String, default: '' },
    SubmittedAt: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    TableNumber: { type: Number, required: true },
    Status: { 
        type: Number, 
        enum: Object.values(ORDER_STATUS),
        required: true,
        default: ORDER_STATUS.PENDING
      },
    CustomerName: { type: String },
    CustomerPhone: { type: String },
    TotalPrice: { type: Number, required: true , default: 0 },
    OrderTime: { type: Date, default: Date.now },
    Items: [
        {
            EdibleName: { type: String, required: true },
            Price: { type: Number, required: true },
            Quantity: { type: Number, required: true , default: 1 }
        }
    ],
    Feedback: { type: [FeedbackSchema], default: [] }
});

// index
OrderSchema.index({ Restaurant: 1 });
OrderSchema.index({ Status: 1 });
OrderSchema.index({ OrderTime: -1 });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
