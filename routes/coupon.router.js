const express = require('express');
const couponController = require('./../controllers/coupon.controller');
const isAuthenticate = require('./../middleware/authentication.middleware');
const { allowedTo } = require('./../middleware/allowedTo.middleware');
const { validation } = require('./../middleware/validation.middleware');
const couponValidation = require('./../validation/coupon.vaildation');

const router = express.Router();

// get all coupon
router.get('/', isAuthenticate, allowedTo('admin', 'seller'), couponController.allCoupons);

// Middlewares
router.use(isAuthenticate, allowedTo('admin'));

// create coupon
router.post('/', validation(couponValidation.createCoupon), couponController.createCoupon);

// update coupon
router.patch('/:name', validation(couponValidation.updateCoupon), couponController.updateCoupon);

// delete coupon
router.delete('/:name', validation(couponValidation.deleteCoupon), couponController.deleteCoupon);

module.exports = router;