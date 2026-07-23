const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        req.session.error_msg = 'Not authorized to access this route';
        return res.redirect('/auth/login');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            req.session.error_msg = 'User not found';
            return res.redirect('/auth/login');
        }

        if (req.user.isBlocked) {
            res.clearCookie('token');
            req.session.error_msg = 'Your account has been blocked. Contact admin.';
            return res.redirect('/auth/login');
        }

        next();
    } catch (err) {
        req.session.error_msg = 'Not authorized to access this route';
        return res.redirect('/auth/login');
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            req.session.error_msg = `User role ${req.user.role} is not authorized to access this route`;
            return res.redirect('/donor/dashboard');
        }
        next();
    };
};