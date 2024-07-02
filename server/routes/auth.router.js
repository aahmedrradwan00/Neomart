const express = require('express');
const authController = require('./../controllers/auth.controller');
const { validation } = require('./../middleware/validation.middleware');
const authvalidation = require('./../validation/auth.validation');
const isAuthenticate = require('./../middleware/authentication.middleware');

const router = express.Router();

//Signup
router.post('/signup', validation(authvalidation.signup), authController.signup);

// Activate Account
router.get('/activateaccount/:token', validation(authvalidation.activateAccount), authController.activateAccount);

//Login
router.post('/login', validation(authvalidation.login), authController.login);

//Logout
router.get('/logout', validation(authvalidation.logout), authController.logout);

// Send Forget Code
router.post('/forgotPassword', validation(authvalidation.forgotPassword), authController.forgotPassword);

// Reset Password
router.post('/resetPassword', validation(authvalidation.resetPassword), authController.resetPassword);

// UpdatePassword
router.patch('/updatePassword', isAuthenticate, validation(authvalidation.updatePassword), authController.updatePassword);

module.exports = router;