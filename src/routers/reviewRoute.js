const express = require('express');
const { auth, restrictTo } = require('../middleware/auth');
const {
    createReview, deleteReview, getReview,
    getReviews, updateReview
} = require('../controllers/reviewCtrl');

const router = new express.Router();

// Routes for reviews
router.route('/')
    .get(auth, getReviews) // Get all reviews
    .post(auth, restrictTo('user'), createReview); // Create a new review

// Routes for a specific review associated with a freelancer
router.route('/:reviewId')
    .get(auth, getReview) // Get a specific review
    .put(auth, restrictTo('user'), updateReview) // Update a specific review
    .delete(auth, restrictTo('user'), deleteReview); // Delete a specific review

module.exports = router;
