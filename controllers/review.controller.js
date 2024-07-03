const Product = require('./../modules/product.model');
const Review = require('./../modules/review.model');
const Order = require('./../modules/order.model');
const catchAsync = require('./../utils/catchAsync');

// Update product average rating
const updateProductAverageRating = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found.', { cause: 404 }));
    let Rates = 0;
    const reviews = await Review.find({ product: productId });
    for (let i = 0; i < reviews.length; i++) Rates += reviews[i].rating;
    product.averageRate = Rates / reviews.length;
    await product.save();
};

exports.addReview = catchAsync(async (req, res, next) => {
    // Request data
    const { productId } = req.params;
    const { tittle, rating } = req.body;
    // Confirm product in order
    const order = await Order.findOne({ user: req.user._id, isDelivered: true, 'cartItems.product': productId });
    if (!order) return next(new Error('You do not have permission to review this product.', { cause: 400 }));
    // Check if review exists
    const reviewIsExit = await Review.findOne({ user: req.user._id, product: productId });
    if (reviewIsExit) return next(new Error('You have previously reviewed this product!', { cause: 400 }));
    // create review
    const review = await Review.create({ user: req.user._id, tittle, rating, product: productId, order: order._id });
    // Update average product rating
    updateProductAverageRating(productId);
    // send respons
    res.status(200).json({ success: true, review });
});

// update review
exports.updateReview = catchAsync(async (req, res, next) => {
    // Request data
    const { productId, id } = req.params;
    // update review
    const review = await Review.findOneAndUpdate({ _id: id, user: req.user._id, product: productId }, { ...req.body });
    if (!review) return next(new Error('Unable to update this review!', { cause: 400 }));
    // Update average product rating if exit
    if (req.body.rating) updateProductAverageRating(productId);
    // send respons
    res.status(201).json({ success: true, review });
});

// delete review
exports.deleteReview = catchAsync(async (req, res, next) => {
    // Request data
    const { productId, id } = req.params;
    // delete review
    await Review.findOneAndDelete({ _id: id, user: req.user._id, product: productId });
    // Update average product rating
    updateProductAverageRating(productId);
    // send respons
    res.status(200).json({ success: true, message: 'review deleted successfully!' });
});