
const { body, validationResult } = require('express-validator');

// Product validation rules
exports.validateProduct = [
    body('name')
        .notEmpty().withMessage('Product name is required')
        .trim()
        .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
    
    body('description')
        .notEmpty().withMessage('Description is required')
        .trim()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price must be greater than 0'),
    
    body('category')
        .notEmpty().withMessage('Category is required'),
    
    body('totalCopies')
        .optional()
        .isInt({ min: 0 }).withMessage('Total copies must be a positive number')
];

// Category validation rules
exports.validateCategory = [
    body('name')
        .notEmpty().withMessage('Category name is required')
        .trim()
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
];

// Validation handler
exports.handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};
