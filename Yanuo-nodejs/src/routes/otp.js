const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/otp');

// request new vertication
router.post("/", sendOTP);
router.post("/verifyOTP", verifyOTP);

module.exports = router;