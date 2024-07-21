const express = require('express');
const userController = require('../controllers/otpController');

const router = express.Router();

router.post('/request-otp', userController.requestOTP);
router.post('/register', userController.registerUser);
router.post('/verify-otp', userController.verifyOTP);

module.exports = router;
