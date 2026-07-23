const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail, emailTemplates } = require("../config/email");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "blood_donation_jwt_secret_key_2024_secure", { expiresIn: "30d" });
};

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "admin123";

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, city, state, adminCode } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            req.session.error_msg = "User already exists with this email";
            return res.redirect("/auth/register");
        }

        const role = (adminCode && adminCode === ADMIN_SECRET_CODE) ? "admin" : "user";

        const user = await User.create({ 
            name, email, password, phone, bloodGroup, city, state, role 
        });

        // Send welcome email
        try {
            await sendEmail({
                email: user.email,
                subject: "🎉 Welcome to BloodConnect - Registration Successful!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #dc2626;">Welcome to BloodConnect!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Thank you for registering with BloodConnect - Blood Donation Portal.</p>
                        <p>Your account has been created successfully as a <strong>${user.role}</strong>.</p>
                        <p><strong>Your Details:</strong></p>
                        <ul>
                            <li>Blood Group: ${user.bloodGroup}</li>
                            <li>City: ${user.city || "Not set"}</li>
                            <li>Status: Pending Verification</li>
                        </ul>
                        <p>Complete your profile and upload documents to become a verified donor.</p>
                        <a href="${process.env.BASE_URL || 'http://localhost:3000'}/auth/login" 
                           style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Login Now
                        </a>
                        <p style="margin-top: 20px;">Together we can save lives! 🩸</p>
                    </div>
                `
            });
            console.log("✅ Welcome email sent to:", user.email);
        } catch (emailErr) {
            console.log("⚠️ Welcome email failed:", emailErr.message);
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

        // 🔔 Send Login Alert Email
        try {
            const loginTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            await sendEmail({
                email: user.email,
                subject: "🔐 New Login to Your BloodConnect Account",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #dc2626;">New Login Alert</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>Your BloodConnect account was just logged into.</p>
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Login Details:</strong></p>
                            <ul>
                                <li>Time: ${loginTime} (IST)</li>
                                <li>Email: ${user.email}</li>
                                <li>Role: ${user.role}</li>
                            </ul>
                        </div>
                        <p style="color: #dc2626;"><strong>If this wasn't you, please change your password immediately!</strong></p>
                        <a href="${process.env.BASE_URL || 'http://localhost:3000'}/donor/dashboard" 
                           style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Go to Dashboard
                        </a>
                    </div>
                `
            });
            console.log("✅ Login alert sent to:", user.email);
        } catch (emailErr) {
            console.log("⚠️ Login alert failed:", emailErr.message);
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

        // Send password reset email
        try {
            const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;
            await sendEmail({
                email: user.email,
                subject: "🔑 Password Reset Request - BloodConnect",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #dc2626;">Password Reset Request</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <p>You requested to reset your password. Click the button below:</p>
                        <a href="${resetUrl}" 
                           style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
                            Reset Password
                        </a>
                        <p style="margin-top: 20px;">This link expires in 30 minutes.</p>
                        <p>If you didn't request this, ignore this email.</p>
                    </div>
                `
            });
            console.log("✅ Password reset email sent to:", user.email);
        } catch (emailErr) {
            console.log("⚠️ Password reset email failed:", emailErr.message);
        }

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
