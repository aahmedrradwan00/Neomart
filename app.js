const express = require('express');
const globalErrorHandler = require('./middleware/globalErrorHandler');
const mountRoutes = require('./routes/index');
const cors = require('cors');
const ratelimit = require('express-rate-limit');
const { orderWebhook } = require('./controllers/order.controller');
const app = express();

// Enable other domains to access your application
app.use(cors());

// webhook
app.post('/api/v1/orders/webhook', express.raw({ type: 'application/json' }), orderWebhook);

// Enable JSON data parsing for incoming requests
app.use(express.json());

// Implement rate limiting middleware for all incoming requests
const limiter = ratelimit({ max: 100, windowMs: 30 * 60 * 1000, message: 'to many reqs , Try After 30m' });
app.use('/api', limiter);

// Attach application routes
mountRoutes(app);

// Handle pages that are not found
app.all('*', (req, res, next) => {
    return next(new Error(`THIS PAGE ${req.originalUrl} NOT FOUND`, { cause: 404 }));
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
