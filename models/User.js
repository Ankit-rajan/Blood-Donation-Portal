const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"]
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        default: "A+"
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    dateOfBirth: Date,
    age: {
        type: Number,
        min: [18, "Must be at least 18 years old"],
        max: [65, "Must be under 65 years old"]
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    lastDonationDate: Date,
    medicalStatus: {
        type: String,
        enum: ["healthy", "under_medication", "temporary_unavailable"],
        default: "healthy"
    },
    availability: {
        type: Boolean,
        default: true
    },
    profileImage: {
        type: String,
        default: "default-profile.png"
    },
    governmentId: String,
    bloodReport: String,
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    donationHistory: [{
        date: Date,
        units: Number,
        hospital: String,
        patientName: String
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date
}, {
    timestamps: true
});

// Hash password before saving - Mongoose v9 syntax (no next callback)
userSchema.pre("save", async function() {
    // Only hash if password is modified
    if (!this.isModified("password")) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
