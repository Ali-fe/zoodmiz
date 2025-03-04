const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, default: 'LastName' },
    email: { type: String,  default: '' },
    password: { type: String },
    role: {
        type: String,
        enum: ['systemAdmin', 'restaurantAdmin', 'waiter', 'customer'],
        default: 'customer'
    },
    phone: { type: String , required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
});

// index 
//UserSchema.index({ restaurant: 1 });
UserSchema.index({ name: 1 ,phone : 1});

const User = mongoose.model('User', UserSchema);
module.exports = User;
