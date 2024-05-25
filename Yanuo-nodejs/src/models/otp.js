const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    otp: String,
    createAt: Date,
    expiresAt: Date,
});

module.exports = mongoose.model('Otp', otpSchema);