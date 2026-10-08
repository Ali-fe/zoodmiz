const mongoose = require('mongoose');
const { TABLE_STATUS } = require('../utils/constants');
// Table Schema
const TableSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    numeral: { type: Number, required: true, default: 0 },
    capacity: { type: Number, required: true, default: 2 },
    status: {
        type: String,
        enum: Object.values(TABLE_STATUS),
        default: TABLE_STATUS.AVAILABLE,
    },
    menuUrl: { type: String, default: '' }
});


const Table = mongoose.model('Table', TableSchema);
module.exports = Table;