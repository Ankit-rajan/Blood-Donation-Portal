const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Get admin dashboard
// @route   GET /admin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Get statistics
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDonors = await User.countDocuments({ 
            role: 'user',
            verificationStatus: 'verified'
        });
        const activeDonors = await User.countDocuments({
            role: 'user',
            availability: true,
            isActive: true
        });
        const pendingVerifications = await User.countDocuments({
            verificationStatus: 'pending',
            role: 'user'
        });
        const emergencyRequests = await EmergencyRequest.countDocuments({
            status: 'pending'
        });
        const contactMessages = await Contact.countDocuments({ isRead: false });

        // Blood group analytics
        const bloodGroupAnalytics = await User.aggregate([
            { $match: { role: 'user', verificationStatus: 'verified' } },
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Recent users
        const recentUsers = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(10);

        // Recent emergency requests
        const recentRequests = await EmergencyRequest.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.user,
            stats: {
                totalUsers,
                totalDonors,
                activeDonors,
                pendingVerifications,
                emergencyRequests,
                contactMessages
            },
            bloodGroupAnalytics,
            recentUsers,
            recentRequests
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading admin dashboard';
        res.redirect('/');
    }
};

// @desc    Get all users
// @route   GET /admin/users
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.verification) filter.verificationStatus = req.query.verification;
        if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { phone: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.render('admin/users', {
            title: 'Manage Users',
            user: req.user,
            users,
            currentPage: page,
            totalPages,
            query: req.query
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading users';
        res.redirect('/admin/dashboard');
    }
};

// @desc    Verify donor
// @route   POST /admin/verify-donor/:id
exports.verifyDonor = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { verificationStatus: 'verified' },
            { new: true }
        );

        // Send verification email
        await sendEmail({
            email: user.email,
            subject: 'Verification Approved',
            html: emailTemplates.verificationApprovedEmail(user)
        });

        req.session.success_msg = 'Donor verified successfully';
        res.redirect('/admin/users');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error verifying donor';
        res.redirect('/admin/users');
    }
};

// @desc    Reject donor
// @route   POST /admin/reject-donor/:id
exports.rejectDonor = async (req, res) => {
    try {
        const { reason } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { verificationStatus: 'rejected' },
            { new: true }
        );

        // Send rejection email
        await sendEmail({
            email: user.email,
            subject: 'Verification Rejected',
            html: emailTemplates.verificationRejectedEmail(user, reason)
        });

        req.session.success_msg = 'Donor rejected';
        res.redirect('/admin/users');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error rejecting donor';
        res.redirect('/admin/users');
    }
};

// @desc    Block/Unblock user
// @route   POST /admin/toggle-block/:id
exports.toggleBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = !user.isBlocked;
        await user.save();

        const status = user.isBlocked ? 'blocked' : 'unblocked';
        req.session.success_msg = `User ${status} successfully`;
        res.redirect('/admin/users');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error updating user status';
        res.redirect('/admin/users');
    }
};

// @desc    Delete user
// @route   POST /admin/delete-user/:id
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        req.session.success_msg = 'User deleted successfully';
        res.redirect('/admin/users');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error deleting user';
        res.redirect('/admin/users');
    }
};

// @desc    Get emergency requests
// @route   GET /admin/emergency-requests
exports.getEmergencyRequests = async (req, res) => {
    try {
        const requests = await EmergencyRequest.find()
            .populate('requestedBy', 'name email')
            .sort({ createdAt: -1 });

        res.render('admin/emergency-requests', {
            title: 'Emergency Requests',
            user: req.user,
            requests
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading requests';
        res.redirect('/admin/dashboard');
    }
};

// @desc    Update emergency request status
// @route   POST /admin/update-request/:id
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await EmergencyRequest.findByIdAndUpdate(req.params.id, { status });
        
        req.session.success_msg = 'Request status updated';
        res.redirect('/admin/emergency-requests');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error updating request';
        res.redirect('/admin/emergency-requests');
    }
};

// @desc    Get contact messages
// @route   GET /admin/contacts
exports.getContacts = async (req, res) => {
    try {
        const messages = await Contact.find()
            .sort({ createdAt: -1 });

        res.render('admin/contacts', {
            title: 'Contact Messages',
            user: req.user,
            messages
        });

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error loading messages';
        res.redirect('/admin/dashboard');
    }
};

// @desc    Mark message as read
// @route   POST /admin/mark-read/:id
exports.markAsRead = async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
        req.session.success_msg = 'Message marked as read';
        res.redirect('/admin/contacts');

    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Error updating message';
        res.redirect('/admin/contacts');
    }
};