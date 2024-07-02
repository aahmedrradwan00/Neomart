const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const categoryRouter = require('./category.router');
const subcategoryRouter = require('./subcategory.router');
const couponRouter = require('./coupon.router');
const brandRouter = require('./brand.router');
const productRouter = require('./product.router');
const wishlistRouter = require('./wishlist.router');
const cartRouter = require('./cart.router');
const orderRouter = require('./order.router');
const reviewRouter = require('./review.router');

// routers
const mountRoutes = (app) => {
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/category', categoryRouter);
    app.use('/api/v1/subcategory', subcategoryRouter);
    app.use('/api/v1/coupon', couponRouter);
    app.use('/api/v1/brand', brandRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/wishlist', wishlistRouter);
    app.use('/api/v1/cart', cartRouter);
    app.use('/api/v1/order', orderRouter);
    app.use('/api/v1/review', reviewRouter);
};

module.exports = mountRoutes;