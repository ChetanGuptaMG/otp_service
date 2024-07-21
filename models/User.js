const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobile: { type: String, unique: true },
    name: String,
    email: String,
    otp: String,
    otpExpiry: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
