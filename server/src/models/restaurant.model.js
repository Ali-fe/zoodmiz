const mongoose = require('mongoose');
const { TABLE_STATUS } = require('../utils/constants');


// Location Schema
const LocationSchema = new mongoose.Schema({
    lat: { type: Number, required: true, default: 0.0 },
    lng: { type: Number, required: true, default: 0.0 }
});

// Address Schema
const AddressSchema = new mongoose.Schema({
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: Number, default: 0 },
    buildingNumber: { type: Number, default: 0 }
});

// Table Schema
const TableSchema = new mongoose.Schema({
    numeral: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: Object.values(TABLE_STATUS),
        default: TABLE_STATUS.AVAILABLE,
    }
});

// Menu Schema
const MenuSchema = new mongoose.Schema({
    edibleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Edible', required: true },
    discount: { type: Number, default: 0 },
    available: { type: Boolean, default: true }
});

// Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: AddressSchema, default: {} },
    description: { type: String, default: '' },
    location: { type: LocationSchema, default: {} },
    tables: { type: [TableSchema], default: [] },
    menu: { type: [MenuSchema], default: [] }
});

// indexs
RestaurantSchema.index({ name: 1 });

RestaurantSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;
    //delete obj._id;
    delete obj.tables;
    delete obj.menu;
    delete obj.address._id;
    delete obj.location._id;
    return obj;
}
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
