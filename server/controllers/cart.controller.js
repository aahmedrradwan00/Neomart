const Cart = require('./../modules/cart.model');
const Product = require('./../modules/product.model');
const Coupon = require('./../modules/coupon.model');
const catchAsync = require('./../utils/catchAsync');

// get user cart
exports.getUserCart = catchAsync(async (req, res, next) => {
    let cart;
    // admin fetches all carts
    if (req.user.role === 'admin') cart = await Cart.findById(req.body.cartId);
    // user fetch their own cart
    else if (req.user.role === 'user') cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new Error('cart Not Found!', { cause: 404 }));
    // send response
    return res.status(200).json({ success: true, results: cart.cartItems.length, cart });
});

// add to cart
exports.addToCart = catchAsync(async (req, res, next) => {
    // Request data
    const { productId, quantity } = req.body;
    // check for product existence
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found', { cause: 404 }));
    // check quantity in stock of product
    if (!product.inStock(quantity)) return next(new Error(`Apologies, we only have ${product.availableItems} items in stock.`, { cause: 409 }));
    // Verify if the product is in the cart
    const cartOfProduct = await Cart.findOne({ user: req.user._id, 'cartItems.product': productId });
    if (cartOfProduct) {
        const productIndex = cartOfProduct.cartItems.find((item) => item.product.id === productId);
        const allQantity = productIndex.quantity + quantity;
        // check quantity in stock of product
        if (product.inStock(allQantity)) {
            productIndex.quantity = allQantity;
            await cartOfProduct.save();
            return res.status(201).json({ success: true, results: cartOfProduct.cartItems.length, data: cartOfProduct });
        } else return next(new Error(`Apologies, we only have ${product.availableItems} items in stock.`, { cause: 409 }));
    }
    // add product to the cart's products array
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $addToSet: { cartItems: { product, quantity } } }, { new: true });
    // save cart
    await cart.save();
    // send response
    return res.status(201).json({ success: true, results: cart.cartItems.length, data: cart });
});

// update user cart
exports.updateUserCart = catchAsync(async (req, res, next) => {
    // Request data
    const { productId, quantity } = req.body;
    // check for product existence
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found', { cause: 404 }));
    // check quantity in stock of product
    if (!product.inStock(quantity)) return next(new Error(`Apologies, we only have ${product.availableItems} items in stock.`, { cause: 409 }));
    // update cart
    const cart = await Cart.findOneAndUpdate({ user: req.user._id, 'cartItems.product': productId }, { 'cartItems.$.quantity': quantity }, { new: true });
    // save cart to calc finalPrice after add coupon
    await cart.save();
    // send response
    res.status(200).json({ success: true, data: cart });
});

// remove from cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
    // Request data
    const { productId } = req.params;
    // check for product existence
    const product = await Product.findById(productId);
    if (!product) return next(new Error('product not found', { cause: 404 }));
    // remove product to the cart's products array
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $pull: { cartItems: { product: productId } } }, { new: true });
    // save cart to calc finalPrice after add coupon
    await cart.save();
    // send response
    res.status(200).json({ success: true, data: cart });
});

// clear cart
exports.clearCart = catchAsync(async (req, res, next) => {
    // find cart and remove all products
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { cartItems: [] }, { new: true });
    // save cart
    await cart.save();
    // send response
    res.status(200).json({ success: true, data: cart });
});

// applay coupon
exports.applayCoupon = catchAsync(async (req, res, next) => {
    // check for coupon existence
    const coupon = await Coupon.findOne({ name: req.body.name, expiredAt: { $gt: Date.now() } });
    if (!coupon) return next(new Error('coupon not found or expired', { cause: 404 }));
    // add coupon to cart
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { coupon }, { new: true });
    // save cart
    await cart.save();
    // send response
    res.status(200).json({ success: true, data: cart });
});

// remove coupon
exports.removeCoupon = catchAsync(async (req, res, next) => {
    // check for coupon existence
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new Error('cart not found', { cause: 404 }));
    //update cart
    cart.coupon = undefined;
    cart.priceAfterDiscount = undefined;
    // save cart
    cart.save();
    // send response
    res.status(200).json({ success: true, data: cart });
});
