const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    type: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    status: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

// index
AccountSchema.index({ restaurant: 1 });

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
