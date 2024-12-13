const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.flash('message', 'Please log in to access this page.');
        return res.redirect('/');
    }

    try {
        let decodedToken = jsonwebtoken.verify(token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({email: decodedToken.email})
            .select("-password");

        if (!user) {
            return res.redirect('/users/logout');
        }

        req.user = user;
        next();
    } catch (error) {
        req.flash("message", "Something went wrong");
        return res.redirect('/');
    }
};
