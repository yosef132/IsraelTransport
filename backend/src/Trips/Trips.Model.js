const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    TripID: { type: Number, required: true, unique: true },
    TripName: { type: String, required: true },
    TripType: { type: String, required: true, enum: ['Parks', 'Restaurants', 'Beaches', 'Coffee'] },
    OpenHour: { type: [String], required: false },
    CloseHour: { type: [String], required: false },
    Description: { type: String, required: true },
    ImageURL: { type: String, required: false } 
}, { versionKey: false });

module.exports = mongoose.model('Trip', TripSchema);
