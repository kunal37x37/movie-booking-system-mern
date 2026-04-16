const express = require('express');
const router = express.Router();
const OTP = require('../models/OTP');
const User = require('../models/User');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
router.post('/send-otp', async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        await OTP.deleteMany({ email });

        const otp = generateOTP();
        const newOTP = new OTP({ email, otp });
        await newOTP.save();

        console.log('\n=========================================');
        console.log('🔐 OTP VERIFICATION CODE');
        console.log('=========================================');
        console.log(`📧 Email: ${email}`);
        console.log(`🔢 OTP: ${otp}`);
        console.log(`⏰ Valid for: 5 minutes`);
        console.log('=========================================\n');

        res.status(200).json({ success: true, message: 'OTP sent successfully! Check terminal for OTP.' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Verify OTP
router.post('/verify-otp', async(req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        await OTP.deleteOne({ _id: otpRecord._id });

        console.log('\n=========================================');
        console.log('✅ OTP VERIFIED SUCCESSFULLY');
        console.log(`📧 Email: ${email}`);
        console.log('=========================================\n');

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Resend OTP
router.post('/resend-otp', async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        await OTP.deleteMany({ email });

        const otp = generateOTP();
        const newOTP = new OTP({ email, otp });
        await newOTP.save();

        console.log('\n=========================================');
        console.log('🔄 OTP RESENT');
        console.log('=========================================');
        console.log(`📧 Email: ${email}`);
        console.log(`🔢 New OTP: ${otp}`);
        console.log('=========================================\n');

        res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;