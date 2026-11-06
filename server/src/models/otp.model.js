const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

OtpSchema.index({ phone: 1 });

module.exports = mongoose.model('Otp', OtpSchema); 