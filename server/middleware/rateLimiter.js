const rateLimit = require('express-rate-limit');

// General API rate limit — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests — please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict login rate limit — 5 attempts per 15 minutes (brute-force protection)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many login attempts — account temporarily locked. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, loginLimiter };
