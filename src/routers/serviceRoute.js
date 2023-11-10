const express = require('express');
const { auth } = require('../middleware/auth');
const {
    addNewService, getService, getAllServices,
    updateService, deleteService, allServices
} = require('../controllers/serviceCtrl');

const bidRouter = require('./bidRoute');

const router = new express.Router();

// Nested routes for bids
// This will handle routes like '/services/:serviceId/bids/'
router.use('/:serviceId/bids', bidRouter);

// Routes for managing services
router.post('/', auth, addNewService); // Add a new service
router.get('/:id', auth, getService); // Get a specific service by ID
router.get('/', auth, getAllServices); // Get all services for authenticated user
router.get('/overview', allServices); // Get an overview of services
router.patch('/:id', auth, updateService); // Update a specific service by ID
router.delete('/:id', auth, deleteService); // Delete a specific service by ID

module.exports = router;
