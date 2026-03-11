const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
};

// Sanitize and validate login input
const loginRules = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().trim().withMessage('Password is required'),
];

// Sanitize user creation
const userRules = [
    body('name').trim().escape().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['accountant', 'admin', 'auditor']).withMessage('Invalid role'),
];

// Generic text field sanitizer — strips HTML to prevent XSS
const sanitizeFields = (...fields) => {
    return fields.map(field => body(field).optional().trim().escape());
};

module.exports = { handleValidation, loginRules, userRules, sanitizeFields };
