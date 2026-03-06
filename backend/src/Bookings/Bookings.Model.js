const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    BookingID: { type: Number, required: true, unique: true },
    UserID: { type: Number, required: true },
    status: { type: String, required: true, enum: ['Pending', 'Confirmed', 'Cancelled'] },
    Passengers: { type: Number, required: true },
    PickupAddress: { type: String, required: true },
    DropOffAddress: { type: String, required: true },
    FullName: { type: String, required: true },
    Email: { type: String, required: true },
    PhoneNumber: { type: String, required: true },
    startTrailDate: { type: Date, required: true }, 
    endTrailDate: { type: Date, required: true },
    stopStations: {type: [String], required:false },
    notes: {type: String, required:false}
}, { versionKey: false });

module.exports = mongoose.model('Booking', BookingSchema, 'Bookings');
