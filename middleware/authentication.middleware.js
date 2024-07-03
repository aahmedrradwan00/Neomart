const User = require('./../modules/user.model');
const Token = require('./../modules/token.model');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

const isAuthenticated = catchAsync(async (req, res, next) => {
    // extract payload
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new Error('You are not logged in! Please log in to get access.', { cause: 401 }));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // check token in datebase
    const currentToken = await Token.findOne({ token, isValid: true });
    if (!currentToken) {
        return next(new Error('token not found', { cause: 401 }));
    }
    // check user
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
        return next(new Error('The user belonging to this token not found', { cause: 401 }));
    }
    // get user
    req.user = currentUser;
    // call next middleware
    next();
});

module.exports = isAuthenticated;
