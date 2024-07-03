const joi = require('joi');
const { ObjectIdValidation } = require('./../middleware/validation.middleware');

exports.createOrder = joi.object({
        phone: joi.string().pattern(new RegExp('^(20)?01[0-25][0-9]{8}$')).required(),
        paymentMethod: joi.string().valid('cash', 'card').required(),
        address: joi.string().required(),
        city: joi.string().required(),
        coupon: joi.string().length(8),
    }).required();

    exports.updateOrderToDelivered = joi.object({
        id: joi.string().custom(ObjectIdValidation).required(),
    }).required();
    
    exports.updateOrderStatus = joi.object({
        id: joi.string().custom(ObjectIdValidation).required(),
        status: joi.string().required(),
    }).required();
    
    exports.cancelOrder = joi.object({
            id: joi.string().custom(ObjectIdValidation).required(),
        }).required();
