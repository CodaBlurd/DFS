const express = require('express');
const { auth } = require('../middleware/auth');
const Message = require('../models/message');
const { catchAsync } = require('../helper/catchPromiseRejection');

const router = new express.Router({ mergeParams: true });

// Route to get messages for a specific conversation
router.get('/conversations/:conversationId', auth, catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    try {
        const messages = await Message.find({ conversationId }).populate('senderId');
        res.json(messages);
    } catch (error) {
        next(error); // Forward error to error handling middleware
    }
}));

// Route to get all conversations for the authenticated user
router.get('/conversations', auth, catchAsync(async (req, res, next) => {
    try {
        const conversations = await Message.find({ users: req.user._id }).populate('users', '-password');
        res.json(conversations);
    } catch (error) {
        next(error); // Forward error to error handling middleware
    }
}));

module.exports = router;
