const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const { body, validationResult } = require('express-validator');

// Home page
router.get('/', async (req, res) => {
    try {
        // Get stats for homepage
        const totalDonors = await User.countDocuments({ 
            verificationStatus: 'verified',
            availability: true 
        });
        const activeRequests = await EmergencyRequest.countDocuments({ status: 'pending' });
        const livesSaved = await User.aggregate([
            { $unwind: '$donationHistory' },
            { $group: { _id: null, total: { $sum: '$donationHistory.units' } } }
        ]);

        res.render('pages/home', {
            title: 'Blood Donation Portal - Save Lives',
            user: req.user,
            stats: {
                totalDonors,
                activeRequests,
                livesSaved: livesSaved[0] ? livesSaved[0].total * 3 : 0 // Assuming 1 unit saves 3 lives
            }
        });
    } catch (error) {
        console.error(error);
        res.render('pages/home', {
            title: 'Blood Donation Portal',
            user: req.user,
            stats: { totalDonors: 0, activeRequests: 0, livesSaved: 0 }
        });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About Us',
        user: req.user
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Contact Us',
        user: req.user
    });
});

// Handle contact form submission
router.post('/contact', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.error_msg = errors.array()[0].msg;
            return res.redirect('/contact');
        }

        await Contact.create(req.body);
        req.session.success_msg = 'Message sent successfully. We will get back to you soon.';
        res.redirect('/contact');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error sending message. Please try again.';
        res.redirect('/contact');
    }
});

module.exports = router;