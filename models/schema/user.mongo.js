const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Role: { type: Number, required: true },
    Email: { type: String, required: true },
    Phone: { type: String }
});

// index 
UserSchema.index({ Restaurant: 1 });
UserSchema.index({ Username: 1 });

const User = mongoose.model('User', UserSchema);
module.exports = User;
