const Cart = require('./../modules/cart.model');
const Product = require('./../modules/product.model');
const Order = require('./../modules/order.model');
const Coupon = require('./../modules/coupon.model');
const catchAsync = require('./../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// cerate order
exports.cerateOrder = catchAsync(async (req, res, next) => {
    // Request data
    const { phone, paymentMethod, address, city, coupon } = req.body;
    // check for cart existence
    const cart = await Cart.findOne({ user: req.user._id });
    // check coupon
    if (coupon) {
        coupon = await Coupon.findOne({ name: req.body.name, expiredAt: { $gt: Date.now() } });
        if (!coupon) return next(new Error('coupon not found or expired', { cause: 404 }));
    }
    //calc tottal OrderPrice
    const taxPrice = 0;
    const shippingPrice = 0;
    const cartPrice = cart.priceAfterDiscount ? cart.priceAfterDiscount : cart.cartPrice;
    const OrderPrice = cartPrice + taxPrice + shippingPrice;
    // Verify if paymentMethod is cash
    if (paymentMethod === 'cash') {
        // create order
        const order = await Order.create({
            user: req.user._id,
            cartItems: cart.cartItems,
            shippingAddress: { address, city },
            OrderPrice,
            phone,
            paymentMethod,
        });
        // update quantity in stock of product
        if (order) {
            cart.cartItems.forEach(async (item) => {
                await Product.findByIdAndUpdate(item.product._id, {
                    $inc: {
                        soldItems: item.quantity,
                        availableItems: -item.quantity,
                    },
                });
            });
            //clear cart
            await Cart.findOneAndUpdate({ user: req.user._id }, { cartItems: [] });
        }
        // send response
        return res.status(200).json({ success: true, data: order });
    } // Verify if paymentMethod is card
    else if (paymentMethod === 'card') {
        // create stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'egp',
                        product_data: {
                            name: req.user.name,
                        },
                        unit_amount: OrderPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/orders`,
            cancel_url: `${req.protocol}://${req.get('host')}/cart`,
            customer_email: req.user.email,
            metadata: { address },
        });
        // send response
        return res.status(200).json({ success: true, data: session.url });
    }
});

// update order to delivered
exports.updateOrderToDelivered = catchAsync(async (req, res, next) => {
    // check for order existence
    const order = await Order.findById(req.params.id);
    if (!order) return next(new Error('Order not found', { cause: 404 }));
    // update order
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    //save order
    await order.save();
    // send response
    return res.status(200).json({ success: true, data: order });
});

// update order status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    // Request data
    const { status } = req.body;
    // check for order existence
    const order = await Order.findById(req.params.id);
    if (!order) return next(new Error('Order not found', { cause: 404 }));
    // update order
    order.status = status;
    //save order
    await order.save();
    // send response
    return res.status(200).json({ success: true, data: order });
});

// cancel order
exports.cancelOrder = catchAsync(async (req, res, next) => {
    // check for order existence
    const order = await Order.findById(req.params.id);
    if (!order) return next(new Error('Order not found', { cause: 404 }));
    // Verify order owner
    if (order.user.toString() !== req.user._id.toString()) return next(new Error(' you do not have permission to perform this operation!!', { cause: 401 }));
    // update order
    order.status = 'canceled';
    //save order
    await order.save();
    // update quantity in stock of product
    order.cartItems.forEach(async (item) => {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: {
                soldItems: -item.quantity,
                availableItems: item.quantity,
            },
        });
    });
    // send response
    return res.status(200).json({ success: true, message: 'order canceled!' });
});

// order webhook
exports.orderWebhook = catchAsync(async (req, res, next) => {});

// get all order
exports.allOrder = catchAsync(async (req, res, next) => {
    let orders;
    // admin fetches all orders
    if (req.user.role === 'admin') orders = await Order.find();
    // user fetch their own order
    else if (req.user.role === 'user') orders = await Order.find({ user: req.user._id });
    if (!orders.length) return next(new Error('Orders Not Found!', { cause: 404 }));
    // send response
    return res.status(200).json({ success: true, results: orders.length, orders });
});