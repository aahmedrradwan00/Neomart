const Coupon = require('./../modules/coupon.model');
const catchAsync = require('./../utils/catchAsync');
const randomize = require('randomatic');

// create coupon
exports.createCoupon = catchAsync(async (req, res, next) => {
    // generate coupon
    const key = randomize('A0', 8);
    // create coupon
    const newCoupon = await Coupon.create({
        name: key,
        createdBy: req.user._id,
        discount: req.body.discount,
        expiredAt: new Date(Date.now() + req.body.expiredAt * 24 * 60 * 60 * 1000).getTime(),
    });
    // send response
    res.status(201).json({ success: true, newCoupon });
});

// update coupon
exports.updateCoupon = catchAsync(async (req, res, next) => {
    // check for coupon existence
    const coupon = await Coupon.findOne({ name: req.params.name });
    if (!coupon) return next(new Error('Coupon Not Found !', { cause: 404 }));
    // Verify coupon seller ownership
    if (req.user.id !== coupon.createdBy.toString()) return next(new Error('You do not have permission to perform this operation!', { cause: 401 }));
    // Check if coupon is expired
    if (coupon.expiredAt < Date.now()) return next(new Error('Coupon is expired !', { cause: 401 }));
    // update coupon
    if (req.body.discount) coupon.discount = req.body.discount;
    if (req.body.expiredAt) coupon.expiredAt = new Date(Date.now() + req.body.expiredAt * 24 * 60 * 60 * 1000).getTime();
    // save coupon
    await coupon.save();
    // send response
    res.status(201).json({ success: true, coupon });
});

// delete coupon
exports.deleteCoupon = catchAsync(async (req, res, next) => {
    // check for coupon existence
    const coupon = await Coupon.findOne({ name: req.params.name });
    if (!coupon) return next(new Error('Coupon Not Found !', { cause: 404 }));
    // Verify coupon seller ownership
    if (req.user.id !== coupon.createdBy.toString()) return next(new Error('You do not have permission to perform this operation!', { cause: 401 }));
    // delete coupon from database
    await coupon.deleteOne();
    // send response
    res.status(200).json({ success: true, message: 'coupon deleted' });
});

exports.allCoupons = catchAsync(async (req, res, next) => {
    let coupons;
    // admin fetches all coupons
    if (req.user.role === 'admin') coupons = await Coupon.find();
    // sellers fetch their own coupons
    else if (req.user.role === 'seller') coupons = await Coupon.find({ createdBy: req.user._id });
    if (!coupons.length) return next(new Error('Coupons Not Found!', { cause: 404 }));
    // send response
    return res.status(200).json({ success: true, results: coupons.length, coupons });
});
