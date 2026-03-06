const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    language: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    userType: { type: String, required: true }, 
    userID: { type: Number, required: true, unique: true },
    drivingLicense: { type: String, required: true },
    drivingLicenseExpiration: { type: Date, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Driver', DriverSchema);
