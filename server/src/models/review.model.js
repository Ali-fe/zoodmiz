const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000, default: '' }
}, { timestamps: true });

ReviewSchema.index({ restaurant: 1, customer: 1 }, { unique: true });
ReviewSchema.index({ restaurant: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
