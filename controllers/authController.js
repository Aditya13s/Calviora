const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const ownerModel = require('../models/owner-model');
const { sanitizeInput } = require('../utils/validation');

module.exports.registerUser = async (req, res) => {
    try {
        let { fullName, email, password } = req.body;

        // Sanitize inputs
        fullName = sanitizeInput(fullName);
        email = sanitizeInput(email);

        // Basic validation
        if (!fullName || !email || !password) {
            req.flash('message', 'All fields are required');
            return res.redirect('/');
        }

        if (fullName.length < 3) {
            req.flash('message', 'Full name must be at least 3 characters long');
            return res.redirect('/');
        }

        if (password.length < 6) {
            req.flash('message', 'Password must be at least 6 characters long');
            return res.redirect('/');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('message', 'Please provide a valid email address');
            return res.redirect('/');
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (user) {
            req.flash('message', 'You already have an account. Please login');
            return res.redirect('/');
        }

        const hash = await bcrypt.hash(password, 12); // Increased from 10 to 12 for better security

        const createdUser = await userModel.create({
            fullName,
            email: email.toLowerCase(),
            password: hash
        });

        req.flash('message', 'User created successfully. Please login');
        return res.redirect('/');

    } catch (err) {
        console.error('Registration error:', err);
        req.flash('message', 'An error occurred during registration. Please try again.');
        return res.redirect('/');
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Sanitize inputs
        email = sanitizeInput(email);

        // Basic validation
        if (!email || !password) {
            req.flash('message', 'Email and password are required');
            return res.redirect('/');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('message', 'Please provide a valid email address');
            return res.redirect('/');
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('message', 'Invalid email or password');
            return res.redirect('/');
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            req.flash('message', 'Invalid email or password');
            return res.redirect('/');
        }

        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return res.redirect('/shop');

    } catch (err) {
        console.error('Login error:', err);
        req.flash('message', 'An error occurred during login. Please try again.');
        return res.redirect('/');
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('token');
    req.flash('message', 'You have been logged out successfully');
    return res.redirect('/');
};

module.exports.verifyOwner = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Sanitize inputs
        email = sanitizeInput(email);

        // Basic validation
        if (!email || !password) {
            req.flash('message', 'Email and password are required');
            return res.redirect('/owners');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('message', 'Please provide a valid email address');
            return res.redirect('/owners');
        }

        const owner = await ownerModel.findOne({ email: email.toLowerCase() });
        if (!owner) {
            req.flash('message', 'Invalid email or password');
            return res.redirect('/owners');
        }

        // Note: This should be updated to use bcrypt for owner passwords too
        if (owner.password === password) {
            req.session.isLoggedIn = true;
            return res.redirect('/owners/admin');
        } else {
            req.flash('message', 'Invalid email or password');
            return res.redirect('/owners');
        }
    } catch (err) {
        console.error('Owner verification error:', err);
        req.flash('message', 'An error occurred during login. Please try again.');
        return res.redirect('/owners');
    }
};
