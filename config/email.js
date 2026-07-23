const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `Blood Donation Portal <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

// Email templates
const emailTemplates = {
    welcomeEmail: (user) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Welcome to Blood Donation Portal</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for registering with Blood Donation Portal. Your account has been created successfully.</p>
            <p>You can now login and complete your profile to become a potential donor.</p>
            <a href="${process.env.BASE_URL}/auth/login" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Login Now</a>
            <p>Together we can save lives!</p>
        </div>
    `,

    passwordResetEmail: (user, resetToken) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Password Reset Request</h2>
            <p>Dear ${user.name},</p>
            <p>You have requested to reset your password. Click the link below to reset it:</p>
            <a href="${process.env.BASE_URL}/auth/reset-password/${resetToken}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>This link will expire in 30 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
    `,

    emergencyAlertEmail: (request, donor) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">🚨 Emergency Blood Request</h2>
            <p>Dear ${donor.name},</p>
            <p>An emergency blood request matching your blood group has been reported in your area.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Request Details:</h3>
                <p><strong>Patient:</strong> ${request.patientName}</p>
                <p><strong>Blood Group:</strong> ${request.bloodGroup}</p>
                <p><strong>Hospital:</strong> ${request.hospitalName}</p>
                <p><strong>City:</strong> ${request.city}</p>
                <p><strong>Urgency:</strong> ${request.urgencyLevel.toUpperCase()}</p>
                <p><strong>Units Required:</strong> ${request.unitsRequired}</p>
                <p><strong>Contact:</strong> ${request.phone}</p>
            </div>
            <p>If you are available and willing to donate, please login to the portal for more details.</p>
            <a href="${process.env.BASE_URL}/auth/login" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Request</a>
            <p>Your donation can save a life!</p>
        </div>
    `,

    verificationApprovedEmail: (user) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Verification Approved! ✅</h2>
            <p>Dear ${user.name},</p>
            <p>Great news! Your donor verification has been approved.</p>
            <p>You are now a verified donor and will appear in public donor searches.</p>
            <p>Thank you for joining our mission to save lives!</p>
        </div>
    `,

    verificationRejectedEmail: (user, reason) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Verification Update</h2>
            <p>Dear ${user.name},</p>
            <p>Unfortunately, your donor verification has been rejected.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>You can re-upload your documents from your profile dashboard.</p>
            <a href="${process.env.BASE_URL}/auth/login" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
        </div>
    `
};

module.exports = { sendEmail, emailTemplates };