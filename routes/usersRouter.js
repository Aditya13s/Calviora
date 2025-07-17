const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logout,
} = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');
const { sanitizeInput } = require('../utils/validation');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.post('/update', isLoggedIn, async (req, res) => {
    try {
        let { phone, address } = req.body;

        // Sanitize inputs
        address = sanitizeInput(address);

        // Validate phone number if provided
        if (phone && !/^\d{10,15}$/.test(phone)) {
            req.flash(
                'message',
                'Please provide a valid phone number (10-15 digits)'
            );
            return res.redirect('/account');
        }

        // Validate address length if provided
        if (address && address.length > 200) {
            req.flash(
                'message',
                'Address cannot be longer than 200 characters'
            );
            return res.redirect('/account');
        }

        const updateData = {};
        if (phone) {
            updateData.phone = phone;
        }
        if (address) {
            updateData.address = address;
        }

        await userModel.findByIdAndUpdate(req.user._id, updateData);
        req.flash('message', 'Your profile has been updated successfully!');
        res.redirect('/account');
    } catch (err) {
        console.error('Profile update error:', err);
        req.flash(
            'message',
            'There was an error updating your profile. Please try again later.'
        );
        res.redirect('/account');
    }
});

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logout);

module.exports = router;
