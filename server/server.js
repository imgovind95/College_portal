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

// Trust proxy for Vercel and Render (required for express-rate-limit)
app.set('trust proxy', 1);

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet — sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://accounts.google.com", "https://apis.google.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://accounts.google.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://accounts.google.com"],
            frameSrc: ["'self'", "https://accounts.google.com"],
        }
    },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

// CORS — only allow specific frontend origins
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Vercel edge functions proxying to themselves)
        if (!origin) return callback(null, true);
        
        // Check if origin matches allowed origins or is a Vercel deployment URL
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-forwarded-for'],
}));

// Rate limiting — 100 requests per 15 minutes per IP
app.use('/api', apiLimiter);

// Body parsing with size limits (prevent payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser for JWT cookies
app.use(cookieParser());

// Gzip compression for performance
app.use(compression());

// HTTP request logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ==========================================
// STATIC FILES (Frontend)
// ==========================================
app.use(express.static(path.join(__dirname, '..'), {
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

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

// ==========================================
// START SERVER (Local/Render) or EXPORT (Vercel)
// ==========================================
const PORT = process.env.PORT || 5000;

// Connect to DB once when the server starts
connectDB();

if (process.env.NODE_ENV !== 'test' && require.main === module) {
    // Running locally or on standard node environments (like Render)
    app.listen(PORT, () => {
        console.log(`\n🚀 GCAMS Server running on port ${PORT}`);
        console.log(`📁 Frontend: http://localhost:${PORT}`);
        console.log(`🔑 API Base: http://localhost:${PORT}/api`);
        console.log(`🛡️  Security: Helmet, CORS, Rate Limiting, JWT Auth`);
        console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}\n`);
    });
}

// Export for Vercel Serverless Functions
module.exports = app;
