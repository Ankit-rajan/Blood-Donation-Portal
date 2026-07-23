const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { sendEmail, emailTemplates } = require('../config/email');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /auth/register
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.error_msg = errors.array()[0].msg;
            return res.redirect('/auth/register');
        }

        const { name, email, password, phone, bloodGroup, city, state } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            req.session.error_msg = 'User already exists with this email';
            return res.redirect('/auth/register');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            bloodGroup,
            city,
            state
        });

        // Send welcome email
        await sendEmail({
            email: user.email,
            subject: 'Welcome to Blood Donation Portal',
            html: emailTemplates.welcomeEmail(user)
        });

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        req.session.success_msg = 'Registration successful! Welcome to Blood Donation Portal';
        res.redirect('/donor/dashboard');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Server error during registration';
        res.redirect('/auth/register');
    }
};

// @desc    Login user
// @route   POST /auth/login
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.error_msg = errors.array()[0].msg;
            return res.redirect('/auth/login');
        }

        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            req.session.error_msg = 'Invalid credentials';
            return res.redirect('/auth/login');
        }

        if (user.isBlocked) {
            req.session.error_msg = 'Your account has been blocked. Contact administrator.';
            return res.redirect('/auth/login');
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            req.session.error_msg = 'Invalid credentials';
            return res.redirect('/auth/login');
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        req.session.success_msg = 'Logged in successfully';

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/donor/dashboard');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Server error during login';
        res.redirect('/auth/login');
    }
};

// @desc    Forgot password
// @route   POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            req.session.error_msg = 'No user found with that email';
            return res.redirect('/auth/forgot-password');
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Send email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                html: emailTemplates.passwordResetEmail(user, resetToken)
            });

            req.session.success_msg = 'Password reset email sent. Check your inbox.';
            res.redirect('/auth/forgot-password');
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            req.session.error_msg = 'Email could not be sent. Please try again.';
            res.redirect('/auth/forgot-password');
        }

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Server error';
        res.redirect('/auth/forgot-password');
    }
};

// @desc    Reset password
// @route   POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            req.session.error_msg = 'Invalid or expired reset token';
            return res.redirect('/auth/forgot-password');
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        req.session.success_msg = 'Password reset successful. Please login.';
        res.redirect('/auth/login');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Server error';
        res.redirect('/auth/forgot-password');
    }
};

// @desc    Logout user
// @route   GET /auth/logout
exports.logout = async (req, res) => {
    res.clearCookie('token');
    req.session.destroy();
    res.redirect('/');
};

// @desc    Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};