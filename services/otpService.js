const twilio = require('twilio');
const User = require('../models/User');
require('dotenv').config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(mobile) {
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    await User.updateOne({ mobile }, { otp, otpExpiry }, { upsert: true });

    await twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile,
    });

    return otp;
}

async function verifyOTP(mobile, otp) {
    const user = await User.findOne({ mobile });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
        throw new Error('Invalid or expired OTP');
    }

    // Clear the OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return true;
}

module.exports = { sendOTP, verifyOTP };
