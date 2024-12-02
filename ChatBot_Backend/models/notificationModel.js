const mongoose = require('mongoose');

// Notification schema definition
const notificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    patientId: { type: String, required: true }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
