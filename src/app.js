const express = require('express');
const userRouter = require('./routers/userRoute');
const serviceRouter = require('./routers/serviceRoute');
const bidRoute = require('./routers/bidRoute');
const reviewRoute = require('./routers/reviewRoute');
const messageRouter = require('./routers/messageRoute');


const app = express();

// Middlewares
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// ... other global middlewares ...

// Routes
app.use('/users', userRouter);
app.use('/services', serviceRouter);
app.use('/bids', bidRoute);
app.use('/reviews', reviewRoute);
app.use('/messages', messageRouter);

module.exports = app;
