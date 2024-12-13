const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String, minLength: 3, trim: true, required: true
    }, email: {
        type: String, required: true, unique: true, lowercase: true, trim: true
    }, password: {
        type: String, required: true, minLength: 6
    }, cart: [{
        _id: false,
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity: {type: Number, default: 1},
    }], orders: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'order', default: []
    }], phone: Number, address: {
        type: String, trim: true, default: ''
    }, picture: String
});

module.exports = mongoose.model('user', userSchema);