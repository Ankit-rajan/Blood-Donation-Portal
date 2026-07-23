const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getCreateRequest,
    createRequest,
    getRequests,
    getRequest
} = require('../controllers/emergencyController');

// Validation
const emergencyValidation = [
    body('patientName').trim().notEmpty().withMessage('Patient name is required'),
    body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Please select a valid blood group'),
    body('hospitalName').trim().notEmpty().withMessage('Hospital name is required'),
    body('hospitalAddress').trim().notEmpty().withMessage('Hospital address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('urgencyLevel').isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Please select urgency level'),
    body('unitsRequired').isInt({ min: 1 }).withMessage('Units required must be at least 1')
];

// Routes
router.get('/create', getCreateRequest);
router.post('/create', emergencyValidation, createRequest);
router.get('/requests', getRequests);
router.get('/request/:id', getRequest);

module.exports = router;