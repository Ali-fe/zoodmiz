const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, required: true }
});

CustomerSchema.index({ name: 1, phone: 1 });

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
