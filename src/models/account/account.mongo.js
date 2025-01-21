const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    type: { type: Number, required: true },
    Start_date: { type: Date, required: true },
    End_date: { type: Date },
    Status: { type: Number, required: true },
    Created_at: { type: Date, default: Date.now }
});

// index
AccountSchema.index({ Restaurant: 1 });

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
