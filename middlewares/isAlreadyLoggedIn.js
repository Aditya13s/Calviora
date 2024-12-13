const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../models/user-model');

// Middleware for login/signup page
module.exports = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jsonwebtoken.verify(token, process.env.JWT_KEY);

        const user = await userModel.findOne({email: decodedToken.email}).select("-password");

        if (user) {
            req.user = user;
            return res.redirect('/shop');
        }

        res.clearCookie('token');
        return next();
    } catch (error) {
        res.clearCookie('token');
        return next();
    }
};
