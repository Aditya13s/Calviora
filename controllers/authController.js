const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateToken');
const ownerModel = require('../models/owner-model')

module.exports.registerUser = async (req, res) => {
    try {
        let {fullName, email, password} = req.body;

        let user = await userModel.findOne({email});
        if (user) {
            req.flash("message", "You already have an account. Please login");
            return res.redirect('/');
        }

        let hash = await bcrypt.hash(password, 10);

        let createdUser = await userModel.create({
            fullName, email, password: hash
        });

        req.flash("message", `User created successfully. Please login`);
        return res.redirect('/');  // Make sure redirect happens after flash message is set

    } catch (err) {
        req.flash("message", err.message);
        return res.redirect('/');
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let {email, password} = req.body;
        let user = await userModel.findOne({email});
        if (!user) {
            req.flash("message", "No user found with this email");
            return res.redirect('/');
        }

        bcrypt.compare(password, user.password, async (err, result) => {
            if (!result) {
                req.flash("message", "Invalid password");
                return res.redirect('/');
            }
            let token = generateToken(user);
            res.cookie('token', token);
            return res.redirect('/shop');
        });
    } catch (err) {
        console.log(err.message);
    }
}

module.exports.logout = (req, res) => {
    res.clearCookie('token');
    req.flash('message', 'You are logged out');
    return res.redirect('/');
}

module.exports.verifyOwner = async (req, res) => {
    try {
        let {email, password} = req.body;
        let owner = await ownerModel.findOne({email});
        if (!owner) {
            req.flash("message", "No owner found with this email");
            return res.redirect('/owners');
        }

        if (owner.password === password) {
            req.session.isLoggedIn = true;
            return res.redirect('/owners/admin');
        } else {
            req.flash('message', "Invalid password");
            return res.redirect('/owners');
        }
    } catch (e) {
        console.log(err.message);
    }
}
