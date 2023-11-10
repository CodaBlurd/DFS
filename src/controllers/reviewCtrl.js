const Review = require('../models/review');
const { catchAsync } = require('../helper/catchPromiseRejection');
const AppError = require('../helper/appErrors');
const User = require('../models/user');

const createReview = catchAsync(async (req, res, next) => {
    const { freelancerId, rating, reviewText } = req.body;

    const freelancer = await User.findById(freelancerId);
    if (!freelancer) {
        return next(new AppError('Invalid freelancer', 400));
    }

    const review = await Review.create({
        reviewerId: req.user._id, // Assuming the reviewer is the logged-in user
        freelancerId,
        rating,
        reviewText
    });

    res.status(201).send(review);
});

const updateReview = catchAsync(async (req, res, next) => {
    const { rating, reviewText } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    if (rating) review.rating = rating;
    if (reviewText) review.reviewText = reviewText;

    await review.save();
    res.status(200).send(review);
});

const getReview = catchAsync(async (req, res, next) => {
    const { freelancerId } = req.params;
    const reviews = await Review.find({ freelancerId: freelancerId })
        .populate('reviewerId', 'name')
        .populate('freelancerId', 'name');

    if (!reviews.length) {
        return next(new AppError('No reviews found for this freelancer', 404));
    }

    res.status(200).send(reviews);
});

const deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    await review.remove();
    res.status(204).send();
});

const getReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find()
        .populate('reviewerId', 'name')
        .populate('freelancerId', 'name');
    
    res.status(200).send({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

const setUserId = (req, res, next) => {
    if (!req.body.serviceId) req.body.serviceId = req.params.serviceId;
    if (!req.body.freelancerId) req.body.freelancerId = req.user._id;

    next();
};

module.exports = {
    createReview,
    getReview,
    getReviews,
    updateReview,
    deleteReview,
    setUserId
};
