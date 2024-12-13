
module.exports = function (req, res, next) {
    const user = req.user;

    if (!user.phone || !user.address) {
        req.flash('message', 'Please provide both phone number and address before proceeding to checkout.');
        return res.redirect('/cart');
    }
    next();
};
