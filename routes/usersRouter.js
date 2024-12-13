const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logout} = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.post('/update', isLoggedIn, async (req, res) => {
    const {phone, address} = req.body;
    try {
        await userModel.findByIdAndUpdate(req.user._id, {phone, address});
        req.flash('message', 'Your profile has been updated successfully!');
        res.redirect('/account');
    } catch (err) {
        req.flash('message', 'There was an error updating your profile. Please try again later.');
        res.redirect('/account');
    }
})

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logout);

module.exports = router;