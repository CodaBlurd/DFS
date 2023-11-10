const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  receiverId: mongoose.Schema.Types.ObjectId,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', MessageSchema);
