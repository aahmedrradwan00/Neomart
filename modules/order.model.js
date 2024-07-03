const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        cartItems: [{ product: { type: mongoose.Types.ObjectId, ref: 'Product' }, quantity: Number, priceItems: Number }],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        phone: { type: String, required: true },
        paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        OrderPrice: { type: Number, required: true },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// populate
orderSchema.pre(/^find/, function (next) {
    this.populate('cartItems.product');
    next();
});

// virtual
orderSchema.virtual('totalItemsPrice').get(function () {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

//calc totalPrice
orderSchema.pre('save', function (next) {
    this.itemsPrice = this.totalItemsPrice;
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
    next();
});

module.exports = mongoose.model('Order', orderSchema);
