const { calAvgRating } = require("./calAvgRating")
const moment = require('moment')

function setResponseTime(days) {
  // Get the current time as a moment object
  const currentTime = moment();

  // Add  specified number of days to the current time
  const responseTime = currentTime.add(days, 'days');

  // Convert  moment object to a JavaScript Date object
  return responseTime.toDate();
}




const bidScoreCal = async (bid) => {
  // Weights (can be adjusted based on what's most important)
  const weights = {
      experienceWeight: 0.2,
      ratingWeight: 0.4,
      responseTimeWeight: 0.1
  };

  // Fetching average rating
  const avgRating = await calAvgRating(bid.user._id.toString());

  // Normalizing scores
  const normalizedExperienceScore = Math.log(1 + parseInt(bid.user.experience)) / Math.log(10); // Logarithmic scale
  const normalizedRatingScore = avgRating / 5; // Assuming 5 is the max rating
  const normalizedResponseTimeScore = 1 - (bid.responseTime / setResponseTime(1)); 

  // Calculating total score
  const totalScore = (
      normalizedExperienceScore * weights.experienceWeight +
      normalizedRatingScore * weights.ratingWeight +
      normalizedResponseTimeScore * weights.responseTimeWeight
  );

  return totalScore;
};


  module.exports = {
    bidScoreCal,
  
  }

  