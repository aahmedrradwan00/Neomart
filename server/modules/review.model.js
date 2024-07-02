const { required } = require('joi');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        tittle: { type: String, required: true, max: 120 },
        rating: { type: Number, min: 1, max: 5, required: true },
        user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
        order: { type: mongoose.Types.ObjectId, ref: 'Order', required: true },
    },
    { timestamps: true }
);

// populate
reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
});

module.exports = mongoose.model('Review', reviewSchema);