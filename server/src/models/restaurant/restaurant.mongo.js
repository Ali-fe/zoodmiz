const mongoose = require('mongoose');
const { TABLE_STATUS } = require('../../utils/constants');


// Location Schema
const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

// Address Schema
const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  buildingNumber: { type: Number, required: true }
});

// Table Schema
const TableSchema = new mongoose.Schema({
  numeral: { type: Number, required: true , default: 0 },
  status: {
    type: String,
    enum: Object.values(TABLE_STATUS),
    default: TABLE_STATUS.AVAILABLE,
  }
});

// Menu Schema
const MenuSchema = new mongoose.Schema({
  edibleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Edible', required: true },
  discount: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
});

// Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  description: { type: String, default: '' },
  location: { type: LocationSchema, required: true },
  tables: { type: [TableSchema], default: [] },
  menu: { type: [MenuSchema], default: [] }
});

// indexs
RestaurantSchema.index({ name: 1 });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
