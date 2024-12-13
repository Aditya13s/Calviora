const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true
    }, products: [{
        _id: false, productId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true
        }, quantity: {
            type: Number, required: true, min: 1
        },
    }], totalAmount: {
        type: Number, required: true
    }, orderDate: {
        type: Date, default: Date.now
    }, status: {
        type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing'
    }
});

module.exports = mongoose.model('order', orderSchema);
