const mongoose = require('mongoose');

const BookingTypeSchema = new mongoose.Schema({
    BookingTypeID: { type: Number, required: true, unique: true },
    TypeName: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('BookingType', BookingTypeSchema);
