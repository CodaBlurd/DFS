const Bid = require('../models/bid');
const Service = require('../models/service');
const User = require('../models/user');
const { catchAsync } = require('../helper/catchPromiseRejection');
const AppError = require('../helper/appErrors');
const { createOne, getOne, deleteOne } = require('./handlerFactory');
const {bidScoreCal} = require('../utils/calculateBidScore');

// Creates a new bid for a particular service
const createBid = createOne(Bid);

// Retrieves a specific bid, populating user and service details
const getBid = getOne(Bid, 'user service');

// Deletes a specific bid
const deleteBid = deleteOne(Bid);

// Retrieves bids by a specific freelancer
const getBidsByFreelancer = catchAsync(async (req, res, next) => {
    const { freelancerId } = req.params;

    if (req.user._id.toString() !== freelancerId) {
        return next(new AppError('You do not have permission to access these bids', 403));
    }

    const bids = await Bid.find({ freelancerId })
        .populate({ path: 'serviceId', select: 'title' });

    res.status(200).json({
        status: 'success',
        results: bids.length,
        data: bids
    });
});

// Retrieves bids for a single service
const getBidsForSingleService = catchAsync(async (req, res, next) => {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);

    if (!service || req.user._id.toString() !== service.user.toString()) {
        return next(new AppError('Service not found or unauthorized access', 403));
    }

    const bids = await Bid.find({ serviceId })
        .populate({ path: 'freelancerId', select: 'name' });

    res.status(200).json({
        status: 'success',
        results: bids.length,
        data: bids
    });
});


async function getTopFreelancersByBidScore() {
    try {
        // Fetch all bids or filter as necessary
        const { serviceId } = req.params;
        const service = await Service.findById(serviceId);
    
        if (!service || req.user._id.toString() !== service.user.toString()) {
            return next(new AppError('Service not found or unauthorized access', 403));
        }
        const bids = await Bid.find(serviceId);

        // Calculate scores for each bid and map them to freelancers
        let scores = await Promise.all(bids.map(async bid => {
            const score = await bidScoreCal(bid);
            return { freelancerId: bid.freelancerId, score };
        }));

        // Group by freelancer and sum scores if a freelancer has multiple bids
        let freelancerScores = scores.reduce((acc, curr) => {
            if (!acc[curr.freelancerId]) {
                acc[curr.freelancerId] = 0;
            }
            acc[curr.freelancerId] += curr.score;
            return acc;
        }, {});

        // Convert to an array and sort by score
        let sortedFreelancers = Object.keys(freelancerScores).map(id => ({
            freelancerId: id, 
            totalScore: freelancerScores[id]
        }));
        sortedFreelancers.sort((a, b) => b.totalScore - a.totalScore);

        // Get top 5 freelancers
        const topFreelancers = sortedFreelancers.slice(0, 5);

        
        const topFreelancerDetails = await Promise.all(
            topFreelancers.map(async freelancer => 
                await User.findById(freelancer.freelancerId))
        );

        return topFreelancerDetails;
    } catch (error) {
        console.error('Error getting top freelancers by bid score:', error);
        throw error; 
    }
}


// Retrieves top freelancers by reviews
const topFreelancersByReviews = catchAsync(async (req, res) => {
    const topFreelancers = await User.aggregate([
        { $match: { type: 'freelancer' } },
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'freelancerId', as: 'reviews' } },
        { $addFields: { avgRating: { $avg: '$reviews.rating' } } },
        { $sort: { avgRating: -1 } },
        { $limit: 5 },
    ]);

    res.status(200).send(topFreelancers);
});

// Accept Bids
const acceptBid = catchAsync(async (req, res, next) => {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId).populate('serviceId');

    if (!bid) {
        return next(new AppError('Bid not found', 404));
    }

    // Check if the current user is the owner of the service
    if (!bid.serviceId || bid.serviceId.user.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to accept this bid', 403));
    }

    // Ensure the bid hasn't already been accepted or processed
    if (bid.status !== 'pending') {
        return next(new AppError('This bid has already been processed', 400));
    }

    // Accept the bid
    bid.status = 'accepted';
    await bid.save();

    // Additional logic (e.g., notifying the freelancer) can be added here

    res.status(200).json({
        status: 'success',
        message: 'Bid accepted successfully'
    });
});


module.exports = {
    createBid,
    getBid,
    deleteBid,
    getBidsForSingleService,
    getBidsByFreelancer,
    topFreelancersByReviews,
    acceptBid,
    getTopFreelancersByBidScore
};
