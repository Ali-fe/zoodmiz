const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    Edibles: [
        {
            EdibleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Edible', required: true },
            Name: { type: String, required: true },
            Price: { type: Number, required: true },
            Category: { type: String },
            Discount: { type: Number, default: 0 }
        }
    ]
});

// index
MenuSchema.index({ Restaurant: 1 });

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;
