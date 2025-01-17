const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    Edibles: [
        {
            EdibleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Edible', required: true },
            Discount: { type: Number, default: 0 },
            Available: { type: Boolean, default: true }
        }
    ]
});

// index
MenuSchema.index({ Restaurant: 1 });

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
