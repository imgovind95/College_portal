const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginRules, userRules, handleValidation } = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

// Google OAuth client (will use the GOOGLE_CLIENT_ID from .env)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });
};

// @route   POST /api/auth/login
// @desc    Login user & return JWT token
// @access  Public (rate-limited)
router.post('/login', loginLimiter, loginRules, handleValidation, async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if account is locked
        if (user.isLocked()) {
            return res.status(423).json({ message: 'Account temporarily locked. Try again later.' });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been deactivated. Contact admin.' });
        }

        // Check if user was created via Google (no password set)
        if (!user.password) {
            return res.status(401).json({ message: 'This account uses Google Sign-In. Please use the Google button.' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            if (user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 min
            }
            await user.save();
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify role matches the user's registered role
        if (role && role !== user.role) {
            return res.status(403).json({ message: `Access denied — you are registered as '${user.role}', not '${role}'` });
        }

        // Reset login attempts on success
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/register
// @desc    Create a new user account
// @access  Public (rate-limited)
router.post('/register', loginLimiter, userRules, handleValidation, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Create user (password is auto-hashed by pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'accountant',
            lastLogin: new Date()
        });

        // Generate token
        const token = generateToken(user._id);

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000
        });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Register error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

// @route   POST /api/auth/google
// @desc    Login or register via Google Sign-In
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Google credential token is required' });
        }

        // Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return res.status(400).json({ message: 'Google account email not available' });
        }

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            // Auto-create a new user from Google account
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: undefined, // No password for Google users
                role: 'accountant',  // Default role for new Google users
                googleId,
                avatar: picture,
                isActive: true,
                lastLogin: new Date()
            });
        } else {
            // Update last login
            user.lastLogin = new Date();
            if (!user.googleId) user.googleId = googleId;
            await user.save();
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been deactivated. Contact admin.' });
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Google auth error:', err.message || err);
        if (err.message && err.message.includes('Token used too late')) {
            return res.status(401).json({ message: 'Google token expired. Please try again.' });
        }
        res.status(401).json({ message: 'Google authentication failed. ' + (err.message || 'Please try again.') });
    }
});

// @route   GET /api/auth/google-client-id
// @desc    Get Google OAuth Client ID for frontend
// @access  Public
router.get('/google-client-id', (req, res) => {
    res.json({ clientId: process.env.GOOGLE_CLIENT_ID || '' });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, (req, res) => {
    res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

// @route   POST /api/auth/logout
// @desc    Logout user (clear cookie)
// @access  Private
router.post('/logout', protect, (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new passwords are required' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        const user = await User.findById(req.user._id).select('+password');
        if (!user.password) {
            return res.status(400).json({ message: 'Google-linked accounts cannot change password here' });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
