const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Get emergency request form
// @route   GET /emergency/create
exports.getCreateRequest = async (req, res) => {
    res.render('emergency/create', {
        title: 'Create Emergency Request',
        user: req.user
    });
};

// @desc    Create emergency request
// @route   POST /emergency/create
exports.createRequest = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.error_msg = errors.array()[0].msg;
            return res.redirect('/emergency/create');
        }

        const requestData = {
            ...req.body,
            requestedBy: req.user ? req.user.id : null
        };

        const request = await EmergencyRequest.create(requestData);

        // Find matching donors in the same city
        const matchingDonors = await User.find({
            bloodGroup: request.bloodGroup,
            city: { $regex: new RegExp(request.city, 'i') },
            verificationStatus: 'verified',
            availability: true,
            isActive: true,
            isBlocked: false
        });

        // Send emergency alerts to matching donors
        for (const donor of matchingDonors) {
            await sendEmail({
                email: donor.email,
                subject: '🚨 Emergency Blood Request',
                html: emailTemplates.emergencyAlertEmail(request, donor)
            });
        }

        req.session.success_msg = 'Emergency request created successfully. Matching donors have been notified.';
        res.redirect('/emergency/requests');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error creating emergency request';
        res.redirect('/emergency/create');
    }
};

// @desc    Get all emergency requests
// @route   GET /emergency/requests
exports.getRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const filter = { status: 'pending' };
        if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
        if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
        if (req.query.urgency) filter.urgencyLevel = req.query.urgency;

        const requests = await EmergencyRequest.find(filter)
            .sort({ createdAt: -1, urgencyLevel: -1 })
            .skip(skip)
            .limit(limit);

        const total = await EmergencyRequest.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.render('emergency/requests', {
            title: 'Emergency Requests',
            user: req.user,
            requests,
            currentPage: page,
            totalPages,
            query: req.query
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading requests';
        res.redirect('/');
    }
};

// @desc    Get single emergency request
// @route   GET /emergency/request/:id
exports.getRequest = async (req, res) => {
    try {
        const request = await EmergencyRequest.findById(req.params.id)
            .populate('requestedBy', 'name email phone');

        if (!request) {
            req.session.error_msg = 'Request not found';
            return res.redirect('/emergency/requests');
        }

        res.render('emergency/request-detail', {
            title: 'Emergency Request Details',
            user: req.user,
            request
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading request';
        res.redirect('/emergency/requests');
    }
};