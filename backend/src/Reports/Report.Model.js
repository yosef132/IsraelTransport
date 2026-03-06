const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    ReportID: { type: Number, required: true, unique: true },
    UserID: { type: Number, required: true },
    Message: { type: String, required: true },
    Timestamp: { type: Date, default: Date.now, required: true },
    Status: { type: String, required: true, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' }
}, { versionKey: false });

module.exports = mongoose.model('Report', ReportSchema);
