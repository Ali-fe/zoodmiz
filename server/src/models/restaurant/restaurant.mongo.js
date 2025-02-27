const mongoose = require('mongoose');
const { TABLE_STATUS } = require('../../utils/constants');


// Location Schema
const LocationSchema = new mongoose.Schema({
  Lat: { type: Number, required: true },
  Lng: { type: Number, required: true }
});

// Address Schema
const AddressSchema = new mongoose.Schema({
  Street: { type: String, required: true },
  City: { type: String, required: true },
  PostalCode: { type: String, required: true },
  BuildingNumber: { type: Number, required: true }
});

// Table Schema
const TableSchema = new mongoose.Schema({
  Numeral: { type: Number, required: true , default: 0 },
  Status: {
    type: String,
    enum: Object.values(TABLE_STATUS),
    default: TABLE_STATUS.AVAILABLE,
  }
});

// Menu Schema
const MenuSchema = new mongoose.Schema({
  EdibleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Edible', required: true },
  Discount: { type: Number, default: 0 },
  Available: { type: Boolean, default: true }
});

// Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
  Subdomain: { type: String, required: true },
  Name: { type: String, required: true },
  Phone: { type: String, required: true },
  Address: { type: AddressSchema, required: true },
  Description: { type: String, default: '' },
  Link: { type: String, default: '' },
  Location: { type: LocationSchema, required: true },
  Tables: { type: [TableSchema], default: [] },
  Menu: { type: [MenuSchema], default: [] }
});

// indexs
RestaurantSchema.index({ Subdomain: 1 });
RestaurantSchema.index({ Name: 1 });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
