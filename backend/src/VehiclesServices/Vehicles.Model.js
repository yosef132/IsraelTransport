const mongoose = require('mongoose');

const VehicleServiceSchema = new mongoose.Schema({
    ServiceID: { type: Number, required: true, unique: true },
    VehicleID: { type: Number, required: true },
    serviceType: { type: String, required: true },
    serviceDate: { type: Date, required: true },
    km: { type: Number, required: true }
}, { versionKey: false });

module.exports = mongoose.model('VehicleService', VehicleServiceSchema);
