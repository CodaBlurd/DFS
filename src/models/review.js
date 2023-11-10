const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },

}, { timestamps: true})

ReviewSchema.index({ reviewerId: 1, freelancerId: 1 }, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema);
