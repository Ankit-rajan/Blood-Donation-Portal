const User = require("../models/User");
const EmergencyRequest = require("../models/EmergencyRequest");
const { sendEmail } = require("../config/email");

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        const nearbyRequests = await EmergencyRequest.find({
            city: user.city,
            status: "pending",
            bloodGroup: user.bloodGroup
        }).sort({ createdAt: -1 }).limit(5);

        const profileFields = ["name", "email", "phone", "bloodGroup", "gender", "dateOfBirth", "address", "city", "state", "pincode", "medicalStatus", "profileImage"];
        let completedFields = 0;
        profileFields.forEach(field => {
            if (user[field] && user[field] !== "default-profile.png") completedFields++;
        });
        const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

        res.render("donor/dashboard", {
            title: "Donor Dashboard",
            user,
            nearbyRequests,
            profileCompletion,
            donationCount: user.donationHistory ? user.donationHistory.length : 0
        });
    } catch (error) {
        console.error(error);
        req.session.error_msg = "Error loading dashboard";
        res.redirect("/");
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.render("donor/edit-profile", { title: "Edit Profile", user });
    } catch (error) {
        console.error(error);
        res.redirect("/donor/dashboard");
    }
};

exports.updateProfile = async (req, res) => {
    try {
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
            availability: req.body.availability === "on"
        };

        if (req.files) {
            if (req.files.profileImage) updates.profileImage = req.files.profileImage[0].filename;
            if (req.files.governmentId) {
                updates.governmentId = req.files.governmentId[0].filename;
                updates.verificationStatus = "pending";
            }
            if (req.files.bloodReport) updates.bloodReport = req.files.bloodReport[0].filename;
        }

        await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
        req.session.success_msg = "Profile updated successfully";
        res.redirect("/donor/dashboard");
    } catch (error) {
        console.error(error);
        req.session.error_msg = "Error updating profile";
        res.redirect("/donor/edit-profile");
    }
};

exports.searchDonors = async (req, res) => {
    try {
        const { bloodGroup, state, city, pincode } = req.query;
        const query = { verificationStatus: "verified", availability: true, isActive: true, isBlocked: false };
        
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (state) query.state = { $regex: state, $options: "i" };
        if (city) query.city = { $regex: city, $options: "i" };
        if (pincode) query.pincode = pincode;

        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const donors = await User.find(query).select("name bloodGroup city state pincode lastDonationDate availability profileImage").sort({ lastDonationDate: -1 }).skip(skip).limit(limit);
        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.render("donor/search", {
            title: "Search Donors",
            user: req.user,
            donors,
            currentPage: page,
            totalPages,
            query: req.query,
            bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        });
    } catch (error) {
        console.error(error);
        req.session.error_msg = "Error searching donors";
        res.redirect("/");
    }
};

exports.getDonorProfile = async (req, res) => {
    try {
        const donor = await User.findById(req.params.id).select("-password -governmentId -bloodReport -resetPasswordToken");
        if (!donor) {
            req.session.error_msg = "Donor not found";
            return res.redirect("/donor/search");
        }
        res.render("donor/profile", { title: donor.name + "'s Profile", user: req.user, donor });
    } catch (error) {
        console.error(error);
        res.redirect("/donor/search");
    }
};

exports.addDonation = async (req, res) => {
    try {
        const { date, units, hospital, patientName } = req.body;
        const user = await User.findById(req.user.id);
        
        const donationEntry = { date, units: parseInt(units), hospital, patientName };
        user.donationHistory.push(donationEntry);
        user.lastDonationDate = date;
        await user.save();

        // Get the newly added donation ID
        const newDonation = user.donationHistory[user.donationHistory.length - 1];
        const donationId = newDonation._id.toString();

        // Send confirmation email
        try {
            await sendEmail({
                email: user.email,
                subject: "🩸 Blood Donation Recorded - Certificate Available!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #dc2626;">🩸 Donation Confirmed!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Thank you for your blood donation! Your certificate is ready.</p>
                        <a href="${process.env.BASE_URL || 'http://localhost:3000'}/donor/certificate/${donationId}" 
                           style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
                            📜 View Certificate
                        </a>
                    </div>
                `
            });
            console.log("✅ Donation email sent to:", user.email);
        } catch (emailErr) {
            console.log("⚠️ Email failed:", emailErr.message);
        }

        // DIRECT REDIRECT TO CERTIFICATE PAGE
        return res.redirect("/donor/certificate/" + donationId);
        
    } catch (error) {
        console.error(error);
        req.session.error_msg = "Error recording donation";
        res.redirect("/donor/dashboard");
    }
};

// 🏆 CERTIFICATE GENERATOR
exports.getCertificate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const donation = user.donationHistory.id(req.params.donationId);
        
        if (!donation) {
            req.session.error_msg = "Donation record not found";
            return res.redirect("/donor/dashboard");
        }

        res.render("donor/certificate", {
            title: "Donation Certificate",
            user: user,
            donation: donation,
            certificateId: req.params.donationId,
            date: new Date().toLocaleDateString("en-IN", { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        });
    } catch (error) {
        console.error(error);
        res.redirect("/donor/dashboard");
    }
};
