const express = require('express');
const wishlistController = require('./../controllers/wishlist.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const wishlistValidation = require('./../validation/wishlist.validation');

const router = express.Router();

// Middlewares
router.use(isAuthenticate, allowedTo('user'));

// get user Wishlist
router.get('/', wishlistController.getUserWishlist);

// add to wishlist
router.post('/', validation(wishlistValidation.addToWishlist), wishlistController.addToWishlist);

// remove from wishlist
router.delete('/:productId', validation(wishlistValidation.removeFromWishlist), wishlistController.removeFromWishlist);

module.exports = router;