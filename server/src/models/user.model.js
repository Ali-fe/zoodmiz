const mongoose = require('mongoose');
const { USER_ROLE, PERMISSIONS } = require('../utils/constants');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, default: '' },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default: USER_ROLE.ADMIN
    },
    phone: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    permissions: [{
        type: String,
        enum: Object.values(PERMISSIONS) 
    }]
});

// index 
//UserSchema.index({ restaurant: 1 });
UserSchema.index({ name: 1, phone: 1 });

UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj;
}
const User = mongoose.model('User', UserSchema);
module.exports = User;
