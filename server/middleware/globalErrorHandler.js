module.exports = (error, req, res, next) => {
    const statusCode = error.cause || 500;
    const environment = process.env.NODE_ENV || 'production';
    return res.status(statusCode).json({
        success: false,
        message: error.message,
        stack: environment === 'development' ? error.stack : 'protected',
    });
};