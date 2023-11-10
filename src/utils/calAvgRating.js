const Review = require("../models/review")

exports.calAvgRating = async function (userID) {
    const reviews = await Review.find({ userID })
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    const avg = sum / reviews.length
    return avg.toFixed(1)

    
  }

