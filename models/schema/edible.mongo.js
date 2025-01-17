const mongoose = require('mongoose');

// Edible Schema
const EdibleSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    Name: { type: String, required: true },
    ImageURL: { type: String, default: '' }, 
    Price: { type: Number, required: true, default: 0 }, 
    Description: { type: String, default: '' }, 
    Category: { type: String, default: '' }
  });

// index
EdibleSchema.index({ Restaurant: 1 });
EdibleSchema.index({ Category: 1 });

const Edible = mongoose.model('Edible', EdibleSchema);
module.exports = Edible;
