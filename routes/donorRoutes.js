const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadFiles } = require('../middleware/upload');
const {
    getDashboard,
    getEditProfile,
    updateProfile,
    searchDonors,
    getDonorProfile,
    addDonation
} = require('../controllers/donorController');

// All donor routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboard);

// Profile management
router.get('/edit-profile', getEditProfile);
router.post('/edit-profile', uploadFiles, updateProfile);

// Donor search
router.get('/search', searchDonors);
router.get('/profile/:id', getDonorProfile);

// Donation history
router.post('/add-donation', addDonation);

module.exports = router;