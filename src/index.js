require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const config = require('../config/configuration');

const server = http.createServer(app);
const io = socketIo(server, { /* ... */ });
require('./controllers/chatController')(io);

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
