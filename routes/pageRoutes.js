const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const User = require("../models/User");
const EmergencyRequest = require("../models/EmergencyRequest");

// Home page - WITH REAL STATS FROM DATABASE
router.get("/", async (req, res) => {
    try {
        // Get real counts from database
        const totalDonors = await User.countDocuments({ 
            role: "user", 
            verificationStatus: "verified",
            isActive: true,
            isBlocked: false
        });
        
        const activeRequests = await EmergencyRequest.countDocuments({ 
            status: "pending" 
        });
        
        // Calculate lives saved (3 lives per donation unit)
        const livesSavedData = await User.aggregate([
            { $unwind: "$donationHistory" },
            { $group: { _id: null, totalUnits: { $sum: "$donationHistory.units" } } }
        ]);
        const livesSaved = livesSavedData.length > 0 ? livesSavedData[0].totalUnits * 3 : 0;

        res.render("pages/home", { 
            title: "Blood Donation Portal",
            user: req.user || null,
            stats: { 
                totalDonors: totalDonors || 0, 
                activeRequests: activeRequests || 0, 
                livesSaved: livesSaved || 0 
            }
        });
    } catch (error) {
        console.error("Home page error:", error);
        res.render("pages/home", { 
            title: "Blood Donation Portal",
            user: req.user || null,
            stats: { totalDonors: 0, activeRequests: 0, livesSaved: 0 }
        });
    }
});

// About page
router.get("/about", (req, res) => {
    res.render("pages/about", { title: "About Us", user: req.user || null });
});

// Contact page
router.get("/contact", (req, res) => {
    res.render("pages/contact", { title: "Contact Us", user: req.user || null });
});

// Contact form submit
router.post("/contact", async (req, res) => {
    try {
        await Contact.create(req.body);
        req.session.success_msg = "Message sent successfully!";
    } catch (error) {
        req.session.error_msg = "Error sending message";
    }
    res.redirect("/contact");
});

// Make admin route (development only)
router.get("/make-admin/:email", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { role: "admin" },
            { new: true }
        );
        if (user) {
            res.send(`
                <div style="text-align:center; padding:50px; font-family:sans-serif;">
                    <h1 style="color:green;">✅ User is now ADMIN!</h1>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <a href="/auth/login" style="color:red; font-size:18px;">Login Now</a>
                </div>
            `);
        } else {
            res.send("<h1>❌ User not found</h1><p>Check the email address.</p>");
        }
    } catch (error) {
        res.send("<h1>❌ Error: " + error.message + "</h1>");
    }
});

module.exports = router;
