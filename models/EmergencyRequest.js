const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    hospitalName: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true
    },
    hospitalAddress: {
        type: String,
        required: [true, 'Hospital address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: [true, 'Urgency level is required']
    },
    unitsRequired: {
        type: Number,
        required: [true, 'Number of units is required'],
        min: [1, 'Must require at least 1 unit']
    },
    additionalNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fulfilledBy: [{
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        units: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for faster search queries
emergencyRequestSchema.index({ bloodGroup: 1, city: 1, status: 1 });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);