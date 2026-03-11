// ==========================================
// GCAMS — Government College Accountant Management System
// Production-Grade Express Server
// ==========================================

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// 1. Trust proxy for Render/Vercel (Must be before rate limiter)
// This fixes the 'X-Forwarded-For' ValidationError in your logs
app.set('trust proxy', 1);

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet — Updated for Google Auth compatibility
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "https://lh3.googleusercontent.com"],
            connectSrc: ["'self'", "https://accounts.google.com", "https://googleidtoolkit.googleapis.com"],
            frameSrc: ["'self'", "https://accounts.google.com"],
        }
    },
    // Required for Google One Tap / Sign-in Popups
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
}));

// CORS — Updated to dynamically allow Render and localhost
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://college-portal-e3hf.onrender.com' // Your specific Render frontend
];

// Add any additional origins from .env
if (process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN.split(',').forEach(s => allowedOrigins.push(s.trim()));
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                         origin.endsWith('.vercel.app') || 
                         origin.endsWith('.onrender.com');
        
        if (isAllowed) {
            callback(null, true);
        } else {
            // Logging the blocked origin helps with debugging
            console.warn(`CORS blocked request from: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));



// Rate limiting — 100 requests per 15 minutes per IP
app.use('/api', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ==========================================
// STATIC FILES
// ==========================================
app.use(express.static(path.join(__dirname, '../'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
}));

// ==========================================
// API ROUTES
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/ledger', require('./routes/ledgerRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));

// ==========================================
// ERROR HANDLING
// ==========================================

app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler — improved for debugging
app.use((err, req, res, next) => {
    // Log the full error to your server console (Render logs)
    console.error('SERVER_ERROR_LOG:', {
        message: err.message,
        stack: err.stack,
        origin: req.headers.origin
    });

    const statusCode = err.statusCode || 500;
    
    // Send a cleaner message to the client
    res.status(statusCode).json({
        message: (process.env.NODE_ENV === 'production' && statusCode === 500)
            ? 'Internal server error'
            : err.message,
    });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

connectDB();

if (process.env.NODE_ENV !== 'test' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🚀 GCAMS Server running on port ${PORT}`);
        console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}\n`);
    });
}

module.exports = app;
