const Message = require("../models/message");
const AppError = require("../helper/appErrors");
const { authenticateSocket } = require('../middleware/socketAuth');

module.exports = (io) => {
    io.use(authenticateSocket).on('connection', (socket) => {
        console.log('User connected', socket.userId);

        // Join a room with the freelancer's ID
        socket.on('joinRoom', (freelancerId) => {
            const roomName = `chat_${socket.userId}_${freelancerId}`;
            socket.join(roomName);
            console.log(`User ${socket.userId} joined room ${roomName}`);
        });

        // Listen for new messages and save them to the database
        socket.on('sendMessage', async ({ freelancerId, content }) => {
            try {
                const message = new Message({
                    senderId: socket.userId,
                    receiverId: freelancerId,
                    content: content
                });

                await message.save();

                // Broadcast the message to the room
                const roomName = `chat_${socket.userId}_${freelancerId}`;
                io.to(roomName).emit('newMessage', message);
            } catch (error) {
                console.error('An error occurred while saving the message:', error);
                // Optionally, emit an error message back to the client
                socket.emit('messageError', 'An error occurred while sending your message.');
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.userId);
        });
    });
};
