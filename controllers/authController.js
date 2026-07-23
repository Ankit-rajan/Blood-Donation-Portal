const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail, emailTemplates } = require("../config/email");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "blood_donation_jwt_secret_key_2024_secure", { expiresIn: "30d" });
};

// ADMIN SECRET CODE - Change this to your own secret code!
// const ADMIN_SECRET_CODE = "admin123";
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "admin123";

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, city, state, adminCode } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            req.session.error_msg = "User already exists with this email";
            return res.redirect("/auth/register");
        }

        // Check if admin code is correct
        const role = (adminCode && adminCode === ADMIN_SECRET_CODE) ? "admin" : "user";

        const user = await User.create({ 
            name, email, password, phone, bloodGroup, city, state, role 
        });

        // Try to send welcome email
        try {
            await sendEmail({
                email: user.email,
                subject: "Welcome to Blood Donation Portal",
                html: emailTemplates.welcomeEmail(user)
            });
        } catch (emailErr) {
            console.log("Email not sent (OK):", emailErr.message);
        }

        const token = generateToken(user._id);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            path: "/"
        });

        req.session.userId = user._id;
        req.session.success_msg = "Registration successful! Welcome to Blood Donation Portal";
        
        // Redirect admin to admin dashboard
        if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        }
        return res.redirect("/donor/dashboard");
    } catch (error) {
        console.error("Register Error:", error);
        req.session.error_msg = "Registration failed. Please try again.";
        return res.redirect("/auth/register");
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
            req.session.error_msg = "Invalid email or password";
            return res.redirect("/auth/login");
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            req.session.error_msg = "Invalid email or password";
            return res.redirect("/auth/login");
        }

        if (user.isBlocked) {
            req.session.error_msg = "Your account has been blocked. Contact administrator.";
            return res.redirect("/auth/login");
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        const token = generateToken(user._id);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            path: "/"
        });

        req.session.userId = user._id;
        req.session.success_msg = "Logged in successfully!";

        if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        }
        return res.redirect("/donor/dashboard");
        
    } catch (error) {
        console.error("Login Error:", error);
        req.session.error_msg = "Login failed. Please try again.";
        return res.redirect("/auth/login");
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.session.error_msg = "No user found with that email";
            return res.redirect("/auth/forgot-password");
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        req.session.success_msg = "Password reset link sent to your email";
        return res.redirect("/auth/login");
    } catch (error) {
        console.error(error);
        req.session.error_msg = "Error processing request";
        return res.redirect("/auth/forgot-password");
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            req.session.error_msg = "Invalid or expired reset token";
            return res.redirect("/auth/forgot-password");
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        req.session.success_msg = "Password reset successful. Please login.";
        return res.redirect("/auth/login");
    } catch (error) {
        console.error(error);
        req.session.error_msg = "Error resetting password";
        return res.redirect("/auth/forgot-password");
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("token", { path: "/" });
    req.session.destroy();
    return res.redirect("/");
};
