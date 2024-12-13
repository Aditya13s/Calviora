const express = require('express');
const isOwnerLoggedIn = require("../middlewares/isOwnerLoggedIn");
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model')

router.get('/', (req, res) => {
    res.redirect('/');
});

router.post('/create', isOwnerLoggedIn, upload.single('image'), async (req, res) => {
    try {
        let {name, price, discount, bgColor, panelColor, textColor} = req.body;
        discount = discount ? discount : 0;
        let {buffer} = req.file;
        let product = await productModel.create({
            image: buffer, name, price, discount, bgColor, panelColor, textColor
        });
        if (product) {
            req.flash('message', "Product created successfully.");
        } else {
            req.flash('message', "Failed to create product.");
        }
    } catch (e) {
        req.flash('message', e.message);
    }
    return res.redirect('/owners/admin');
});

module.exports = router;