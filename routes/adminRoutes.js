const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboard,
    getUsers,
    verifyDonor,
    rejectDonor,
    toggleBlock,
    deleteUser,
    getEmergencyRequests,
    updateRequestStatus,
    getContacts,
    markAsRead
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// User management
router.get('/users', getUsers);
router.post('/verify-donor/:id', verifyDonor);
router.post('/reject-donor/:id', rejectDonor);
router.post('/toggle-block/:id', toggleBlock);
router.post('/delete-user/:id', deleteUser);

// Emergency requests management
router.get('/emergency-requests', getEmergencyRequests);
router.post('/update-request/:id', updateRequestStatus);

// Contact messages management
router.get('/contacts', getContacts);
router.post('/mark-read/:id', markAsRead);

module.exports = router;