const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const {verifyOwner} = require('../controllers/authController');
const isOwnerLoggedIn = require('../middlewares/isOwnerLoggedIn');


router.get('/', (req, res) => {
    const message = req.flash('message');
    if (req.session.isLoggedIn) {
        return res.redirect('/owners/admin');
    }
    return res.render('owner-login', {message});
});

router.post('/login', verifyOwner);

if (process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        const owners = await ownerModel.find();
        if (owners.length > 0) { // If an owner already exists
            return res.status(503).send('You don\'t have permission to create a new owner.');
        }
        const {fullName, email, password} = req.body;
        const createdOwner = await ownerModel.create({
            fullName, email, password
        });
        res.status(201).send(createdOwner);
    });
}

router.get('/admin', isOwnerLoggedIn, (req, res) => {
    const message = req.flash('message');
    res.render('create-product', {message});
});


module.exports = router;