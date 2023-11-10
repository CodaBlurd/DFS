
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../helper/appErrors');
const { catchAsync } = require('../helper/catchPromiseRejection');
const config = require('../../config/configuration');

exports.auth = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(new AppError('Unauthorized! No token provided.', 401));
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedJwt = jwt.verify(token, config.jsonWebTokenKey);
        const user = await User.findOne({ _id: decodedJwt._id, 'tokens.token': token });

        if (!user) {
            return next(new AppError('Login not authorized', 401));
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Invalid token or token expired', 401));
    }
});



exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission for this action', 403));
        }
        next();
    };
};



