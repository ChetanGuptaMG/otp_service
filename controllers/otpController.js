const otpService = require('../services/otpService');
const User = require('../models/User');

async function requestOTP(req, res) {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).send('Mobile number is required');
    }

    try {
        const user = await User.findOne({ mobile });
        if (user && user.name && user.email) {
            await otpService.sendOTP(mobile);
            res.send('OTP sent');
        } else {
            res.status(202).send('New user. Please provide name and email.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function registerUser(req, res) {
    const { mobile, name, email } = req.body;

    if (!mobile || !name || !email) {
        return res.status(400).send('Mobile number, name, and email are required');
    }

    try {
        await User.updateOne({ mobile }, { name, email }, { upsert: true });
        await otpService.sendOTP(mobile);
        res.send('User registered and OTP sent');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function verifyOTP(req, res) {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).send('Mobile number and OTP are required');
    }

    try {
        await otpService.verifyOTP(mobile, otp);
        res.send('OTP verified successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { requestOTP, registerUser, verifyOTP };
