const jwt = require('jsonwebtoken');
const AppError = require("../helper/appErrors");
const config = require('../../config/configuration');

exports.authenticateSocket = (socket, next) => {
    const token = socket.handshake.query && socket.handshake.query.token;
    if (token) {
        jwt.verify(token, config.jsonWebTokenKey, (err, decoded) => {
            if (err) {
                // Emit an error event to the client in case of authentication failure
                socket.emit('authentication_error', 'Authentication failed');
                return next(new Error('Authentication error'));
            }
            socket.userId = decoded._id; 
            next();
        });
    } else {
        socket.emit('authentication_error', 'Authentication token not provided');
        next(new Error('Authentication error'));
    }
};
