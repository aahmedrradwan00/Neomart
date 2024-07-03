const express = require('express');
const cartController = require('./../controllers/cart.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const cartValidation = require('./../validation/cart.validation');

const router = express.Router();

// get user cart
router.get('/', isAuthenticate, allowedTo('user', 'admin'), cartController.getUserCart);

// Middlewares
router.use(isAuthenticate, allowedTo('user'));

// add product  to cart
router.post('/', validation(cartValidation.addToCart), cartController.addToCart);

// update user cart
router.patch('/', validation(cartValidation.updateUserCart), cartController.updateUserCart);

// remove product from cart
router.patch('/:productId', validation(cartValidation.removeFromCart), cartController.removeFromCart);

// apply coupon
router.put('/applyCoupon', validation(cartValidation.applayCoupon), cartController.applayCoupon);

// remove coupon
router.put('/removeCoupon', cartController.removeCoupon);

// clear cart
router.put('/', cartController.clearCart);

module.exports = router;