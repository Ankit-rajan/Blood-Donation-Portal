const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Please select a valid blood group')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Register routes
router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register' });
});
router.post('/register', registerValidation, register);

// Login routes
router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' });
});
router.post('/login', loginValidation, login);

// Forgot password routes
router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', { title: 'Forgot Password' });
});
router.post('/forgot-password', forgotPassword);

// Reset password routes
router.get('/reset-password/:token', (req, res) => {
    res.render('auth/reset-password', { 
        title: 'Reset Password',
        token: req.params.token 
    });
});
router.post('/reset-password/:token', 
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    resetPassword
);

// Logout route
router.get('/logout', logout);

module.exports = router;