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
    app.use('/api/v1/categorys', categoryRouter);
    app.use('/api/v1/subcategorys', subcategoryRouter);
    app.use('/api/v1/coupons', couponRouter);
    app.use('/api/v1/brands', brandRouter);
    app.use('/api/v1/products', productRouter);
    app.use('/api/v1/wishlists', wishlistRouter);
    app.use('/api/v1/carts', cartRouter);
    app.use('/api/v1/orders', orderRouter);
    app.use('/api/v1/reviews', reviewRouter);
};

module.exports = mountRoutes;