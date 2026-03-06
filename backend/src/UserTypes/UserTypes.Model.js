const mongoose = require('mongoose');

const UserTypeSchema = new mongoose.Schema({
    userTypeID: { type: Number, required: true, unique: true },
    userType: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('UserType', UserTypeSchema);
