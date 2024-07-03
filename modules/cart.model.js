const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cartItems: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
            },
        ],
        cartPrice: { type: Number, default: 0 },
        priceAfterDiscount: Number,
        user: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
        coupon: { type: mongoose.Types.ObjectId, ref: 'Coupon' },
    },
    { timestamps: true }
);

// populate
cartSchema.pre(/^find/, function (next) {
    this.populate('coupon').populate('cartItems.product');
    next();
});

// calc tottal price
cartSchema.pre('save', async function () {
    let totalPrice = 0;
    this.cartItems.forEach((item) => (totalPrice += item.product.finalPrice * item.quantity));
    this.cartPrice = totalPrice;
    if (totalPrice === 0) this.priceAfterDiscount = undefined;
    if (this.coupon && this.coupon.discount) {
        const priceAfterDiscount = (totalPrice - (totalPrice * this.coupon.discount) / 100).toFixed(2);
        this.priceAfterDiscount = parseFloat(priceAfterDiscount);
    } else this.priceAfterDiscount = undefined;
});

module.exports = mongoose.model('Cart', cartSchema);
