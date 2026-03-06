const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    VehicleID: { type: Number, required: true, unique: true },
    Make: { type: String, required: true },
    Model: { type: String, required: true },
    Year: { type: Number, required: true },
    Km: { type: Number, required: true },
    vehicleType: { type: String, required: true },
    carPlateNumber: { type: String, required: true },
    lastMaintenanceKm: { type: Number, default: 0 } // New field to track last maintenance milestone
}, { versionKey: false });

module.exports = mongoose.model('Vehicle', VehicleSchema);
