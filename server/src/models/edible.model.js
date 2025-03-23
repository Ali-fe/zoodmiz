const mongoose = require('mongoose');

// Edible Schema
const EdibleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageURL: { type: String, default: '' },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});
EdibleSchema.method.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;
    delete obj._id;
    delete obj.restaurant;
    return obj;
}
// index
EdibleSchema.index({ restaurant: 1 });
EdibleSchema.index({ category: 1 });

const Edible = mongoose.model('Edible', EdibleSchema);
module.exports = Edible;
