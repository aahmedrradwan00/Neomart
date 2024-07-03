const User = require('../modules/user.model');
const catchAsync = require('../utils/catchAsync');
const Product = require('./../modules/product.model');

// get user wishlist
exports.getUserWishlist = catchAsync(async (req, res, next) => {
    // Find user and populate wishlist
    const user = await User.findById(req.user._id).populate('wishlist');
    // send response
    res.status(200).json({ success: true, results: user.wishlist.length, data: user.wishlist });
});

// add to wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
    // Request data
    const { productId } = req.body;
    // check for product existence
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found!', { cause: 404 }));
    // check product in wishlist
    const productIsExit = await User.findOne({
        _id: req.user._id,
        wishlist: productId,
    });
    if (productIsExit) return next(new Error('Product is already in your wishlist.', { cause: 404 }));
    // add product to wishlist
    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: productId } }, { new: true });
    // send response
    res.status(200).json({ success: true, data: user.wishlist });
});

// remove from wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
    // Request data
    const { productId } = req.params;
    // check for product existence
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found!', { cause: 404 }));
    // remove product to wishlist
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: productId } }, { new: true });
    // send response
    res.status(200).json({ success: true, data: user.wishlist });
});