const express = require('express');
const userController = require('../controllers/user.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');

const router = express.Router();

// Middlewares
router.use(isAuthenticate, allowedTo('user'));

// get profile
router.route('/me').get(userController.getCurrentUser, userController.getUser);

// update profile
router.patch('/', userController.updateProfile);

// Deactivate account
router.put('/', userController.updateProfile);

// Middlewares
router.use(isAuthenticate, allowedTo('admin'));

// for admin -> get users / create user / update user / delete user
router.route('/:id').get(userController.getAllUsers).post(userController.createUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;