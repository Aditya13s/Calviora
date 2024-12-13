const jsonWebToken = require("jsonwebtoken");

const generateToken = (user) => {
    return jsonWebToken.sign({email: user.email, id: user._id}, process.env.JWT_KEY);
};

module.exports.generateToken = generateToken;