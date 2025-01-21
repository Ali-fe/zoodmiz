const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    Username: { type: String, required: true },
    Password: { type: String },
    Role: {
        type: String,
        enum: ['systemAdmin', 'restaurantAdmin', 'waiter', 'customer'],
        default: 'customer'
    },
    Email: { type: String, default: '' },
    Phone: { type: String }
});

// index 
UserSchema.index({ Restaurant: 1 });
UserSchema.index({ Username: 1 });

const User = mongoose.model('User', UserSchema);
module.exports = User;
