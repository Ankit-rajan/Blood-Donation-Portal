const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const { validationResult } = require('express-validator');

// @desc    Get donor dashboard
// @route   GET /donor/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Get recent emergency requests in user's city
        const nearbyRequests = await EmergencyRequest.find({
            city: user.city,
            status: 'pending',
            bloodGroup: user.bloodGroup
        }).sort({ createdAt: -1 }).limit(5);

        // Calculate profile completion percentage
        const profileFields = [
            'name', 'email', 'phone', 'bloodGroup', 'gender', 
            'dateOfBirth', 'address', 'city', 'state', 'pincode',
            'medicalStatus', 'profileImage'
        ];
        
        let completedFields = 0;
        profileFields.forEach(field => {
            if (user[field] && user[field] !== 'default-profile.png') {
                completedFields++;
            }
        });

        const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

        // Get donation history count
        const donationCount = user.donationHistory ? user.donationHistory.length : 0;

        res.render('donor/dashboard', {
            title: 'Donor Dashboard',
            user,
            nearbyRequests,
            profileCompletion,
            donationCount,
            success_msg: req.session.success_msg
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading dashboard';
        res.redirect('/auth/login');
    }
};

// @desc    Get edit profile page
// @route   GET /donor/edit-profile
exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.render('donor/edit-profile', {
            title: 'Edit Profile',
            user
        });
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading profile';
        res.redirect('/donor/dashboard');
    }
};

// @desc    Update profile
// @route   POST /donor/edit-profile
exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.error_msg = errors.array()[0].msg;
            return res.redirect('/donor/edit-profile');
        }

        const updates = {
            name: req.body.name,
            phone: req.body.phone,
            bloodGroup: req.body.bloodGroup,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            lastDonationDate: req.body.lastDonationDate,
            medicalStatus: req.body.medicalStatus,
            availability: req.body.availability === 'on' ? true : false
        };

        // Handle file uploads
        if (req.files) {
            if (req.files.profileImage) {
                updates.profileImage = req.files.profileImage[0].filename;
            }
            if (req.files.governmentId) {
                updates.governmentId = req.files.governmentId[0].filename;
                updates.verificationStatus = 'pending';
            }
            if (req.files.bloodReport) {
                updates.bloodReport = req.files.bloodReport[0].filename;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        req.session.success_msg = 'Profile updated successfully';
        res.redirect('/donor/dashboard');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error updating profile';
        res.redirect('/donor/edit-profile');
    }
};

// @desc    Search donors
// @route   GET /donor/search
exports.searchDonors = async (req, res) => {
    try {
        const { bloodGroup, state, city, pincode } = req.query;
        
        // Build query
        const query = {
            verificationStatus: 'verified',
            availability: true,
            isActive: true,
            isBlocked: false
        };

        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (state) query.state = { $regex: state, $options: 'i' };
        if (city) query.city = { $regex: city, $options: 'i' };
        if (pincode) query.pincode = pincode;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const donors = await User.find(query)
            .select('name bloodGroup city state pincode lastDonationDate availability profileImage')
            .sort({ lastDonationDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.render('donor/search', {
            title: 'Search Donors',
            user: req.user,
            donors,
            currentPage: page,
            totalPages,
            query: req.query,
            bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error searching donors';
        res.redirect('/');
    }
};

// @desc    Get donor profile by ID
// @route   GET /donor/profile/:id
exports.getDonorProfile = async (req, res) => {
    try {
        const donor = await User.findById(req.params.id)
            .select('-password -governmentId -bloodReport -resetPasswordToken');

        if (!donor) {
            req.session.error_msg = 'Donor not found';
            return res.redirect('/donor/search');
        }

        res.render('donor/profile', {
            title: `${donor.name}'s Profile`,
            user: req.user,
            donor
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading donor profile';
        res.redirect('/donor/search');
    }
};

// @desc    Add donation to history
// @route   POST /donor/add-donation
exports.addDonation = async (req, res) => {
    try {
        const { date, units, hospital, patientName } = req.body;

        const user = await User.findById(req.user.id);
        user.donationHistory.push({
            date,
            units,
            hospital,
            patientName
        });
        user.lastDonationDate = date;
        await user.save();

        req.session.success_msg = 'Donation recorded successfully';
        res.redirect('/donor/dashboard');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error recording donation';
        res.redirect('/donor/dashboard');
    }
};