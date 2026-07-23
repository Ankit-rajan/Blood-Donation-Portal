const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploadFiles } = require("../middleware/upload");
const { 
    getDashboard, 
    getEditProfile, 
    updateProfile, 
    searchDonors, 
    getDonorProfile, 
    addDonation,
    getCertificate 
} = require("../controllers/donorController");

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/edit-profile", getEditProfile);
router.post("/edit-profile", uploadFiles, updateProfile);
router.get("/search", searchDonors);
router.get("/profile/:id", getDonorProfile);
router.post("/add-donation", addDonation);

// Certificate route
router.get("/certificate/:donationId", getCertificate);

module.exports = router;
