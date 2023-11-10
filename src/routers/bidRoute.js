const express = require('express');
const { auth, restrictTo } = require('../middleware/auth');
const { setUserId } = require('../controllers/reviewCtrl');
const {
    createBid, getBid, acceptBid,
    deleteBid, getBidsForSingleService, getBidsByFreelancer, getTopFreelancersByBidScore
} = require('../controllers/bidCtrl');

const router = new express.Router({ mergeParams: true });

// Routes for bids
router.route('/')
    .get(auth, getBidsForSingleService) // Get bids for a single service
    .post(auth, restrictTo('user'), setUserId, createBid); // Create a bid

// Routes for retrieving bids by a specific freelancer
router.route('/freelancer/:freelancerId')
    .get(auth, restrictTo('user'), getBidsByFreelancer); // Get bids by freelancer

// Routes for top freelancers for a service
router.route('/top-freelancers/:serviceId')
    .get(auth, restrictTo('user'), getTopFreelancersByBidScore); // Get top freelancers for a service

// You may add other routes here as needed
// For example, routes for getting a specific bid, accepting a bid, deleting a bid, etc.

module.exports = router;
