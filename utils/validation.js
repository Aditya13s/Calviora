const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Common validation rules
const validationRules = {
    // User validation
    userRegistration: [
        body('fullName')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('Full name must be between 3 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Full name can only contain letters and spaces'),

        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),

        body('password')
            .isLength({ min: 6, max: 100 })
            .withMessage('Password must be between 6 and 100 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

        body('phone')
            .optional()
            .isMobilePhone()
            .withMessage('Please provide a valid phone number'),
    ],

    userLogin: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),

        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],

    // Product validation
    productCreation: [
        body('name')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Product name must be between 1 and 100 characters'),

        body('price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),

        body('discount')
            .optional()
            .isFloat({ min: 0, max: 100 })
            .withMessage('Discount must be between 0 and 100'),

        body('bgcolor')
            .optional()
            .matches(/^#[0-9A-F]{6}$/i)
            .withMessage('Background color must be a valid hex color'),

        body('panelcolor')
            .optional()
            .matches(/^#[0-9A-F]{6}$/i)
            .withMessage('Panel color must be a valid hex color'),

        body('textcolor')
            .optional()
            .matches(/^#[0-9A-F]{6}$/i)
            .withMessage('Text color must be a valid hex color'),
    ],

    // Cart validation
    cartUpdate: [
        body('productId')
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('Invalid product ID');
                }
                return true;
            }),

        body('quantity')
            .isInt({ min: 0, max: 5 })
            .withMessage('Quantity must be between 0 and 5'),
    ],

    // MongoDB ObjectId validation
    mongoId: [
        param('id')
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('Invalid ID format');
                }
                return true;
            }),
    ],

    mongoProductId: [
        param('productid')
            .custom((value) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('Invalid product ID format');
                }
                return true;
            }),
    ],
};

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('message', errorMessages.join('. '));
        return res.redirect('back');
    }

    next();
};

// API validation error handler (for JSON responses)
const handleApiValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }

    next();
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
    if (typeof input !== 'string') {return input;}

    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim();
};

// Validate environment variables
const validateEnvironment = () => {
    const required = ['MONGODB_URI', 'EXPRESS_SESSION_SECRET'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

module.exports = {
    validationRules,
    handleValidationErrors,
    handleApiValidationErrors,
    sanitizeInput,
    validateEnvironment,
};