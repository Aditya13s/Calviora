const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    }, price: {
        type: Number, required: true, min: 0
    }, discount: {
        type: Number, default: 0, min: 0, max: 100
    }, image: {
        type: Buffer, required: true
    }, bgColor: {
        type: String, default: '#ffffff'
    }, panelColor: {
        type: String, default: '#f0f0f0'
    }, textColor: {
        type: String, default: '#000000'
    }
});

module.exports = mongoose.model('product', productSchema);
