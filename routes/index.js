const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn')
const isAlreadyLoggedIn = require('../middlewares/isAlreadyLoggedIn')
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const mongoose = require('mongoose');
const orderModel = require('../models/order-model');

router.get('/', isAlreadyLoggedIn, (req, res) => {
    let message = req.flash('message');
    res.render('index', {message});
});

router.get('/account', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); // Assuming you have a logged-in user

        // Populate the products in each order
        const orders = await orderModel.find({userId: user._id})
            .populate('products.productId'); // Populate the product data

        // Pass the orders to the view
        res.render('account', {user, orders, loggedIn: true, message: req.flash('message')});
    } catch (err) {
        req.flash('message', 'An error occurred while fetching orders');
        res.redirect('/shop');
    }
});

router.post('/checkout', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.user.email}).populate('cart.productId');

        if (!user || !user.cart.length) {
            req.flash('message', 'Your cart is empty.');
            return res.redirect('/cart');
        }

        // Prepare order details
        const products = user.cart.map(item => ({
            productId: item.productId._id, quantity: item.quantity
        }));

        const totalAmount = user.cart.reduce((total, item) => {
            const price = item.productId.price;
            const discount = (price * item.productId.discount) / 100;
            return total + (price - discount) * item.quantity;
        }, 0);

        // Create and save the order
        const newOrder = await orderModel.create({
            userId: user._id, products, totalAmount
        });

        // Update user's orders and clear the cart
        user.orders.push(newOrder._id);
        user.cart = [];
        await user.save();

        req.flash('message', 'Order placed successfully!');
        res.redirect('/account');
    } catch (error) {
        req.flash('message', 'An error occurred while placing your order.');
        res.redirect('/cart');
    }
});


router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email})
            .populate('cart.productId');
        let totalMRP = 0, totalDiscount = 0, netTotal = 0;

        // Loop through the user's cart and calculate totals
        user.cart.forEach(item => {
            const price = item.productId.price;
            const discount = (price * item.productId.discount) / 100;

            totalMRP += price * item.quantity;
            totalDiscount += discount * item.quantity;
            netTotal += (price - discount) * item.quantity;
        });

        // Platform fee and final total calculation
        const platformFee = 20;
        const finalTotal = netTotal + platformFee;

        let message = req.flash('message');
        // Render the 'cart' page with calculated totals and user data
        res.render('cart', {
            loggedIn: true,
            user: user,
            message,
            totalMRP: totalMRP.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            finalTotal: finalTotal.toFixed(2)
        });
    } catch (error) {
        req.flash('message', 'An error occurred while fetching your cart.');
        res.redirect('/shop');
    }
});

router.get("/cart/add/:productid", isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.productid;

        // Validate product ID
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            req.flash('message', 'Invalid product ID.');
            return res.redirect('/shop');
        }


        let user = await userModel.findOne({email: req.user.email});
        if (!user) {
            req.flash('message', 'User not found. Please log in again.');
            return res.redirect('/users/logout');
        }
        const maxQuantity = 5;

        const existingProduct = user.cart.find(item => item.productId.toString() === productId);
        if (existingProduct) {
            if (existingProduct.quantity < maxQuantity) {
                existingProduct.quantity += 1;
            } else {
                req.flash('message', `You can add a maximum of ${maxQuantity} items of the same product.`);
                return res.redirect('/shop');
            }
        } else {
            // Add new product with quantity 1
            user.cart.push({productId, quantity: 1});
        }


        await user.save();
        req.flash('message', "Product added to cart.");
        res.redirect('/shop');

    } catch (error) {
        console.log(error);
        req.flash('message', 'An error occurred while adding the product to the cart.');
        res.redirect('/shop');
    }
});

router.post('/cart/update', isLoggedIn, async (req, res) => {
    let {productId, quantity} = req.body;
    quantity = parseInt(req.body.quantity, 10);

    // Validate inputs
    if (!productId || quantity < 0 || quantity > 5) {
        return res.redirect('/cart');
    }

    try {
        const user = await userModel.findOne({email: req.user.email});

        if (!user) {
            return res.redirect('/cart');
        }

        // Find the product in the cart
        const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex === -1) {
            return res.redirect('/cart');
        }

        // If quantity is 0, remove the item from the cart
        if (quantity === 0) {
            user.cart.splice(cartItemIndex, 1);  // Remove the item from the cart
        } else {
            // Otherwise, update the quantity
            user.cart[cartItemIndex].quantity = quantity;
        }

        // Save the updated user document
        await user.save();

        // Redirect to the cart page after the update
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.redirect('/cart');
    }
});

router.get('/shop', isLoggedIn, async (req, res) => {
    let products = await productModel.find();
    let message = req.flash('message');
    res.render('shop', {products, message, loggedIn: true});
});

module.exports = router;