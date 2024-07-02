const joi = require('joi');
const { ObjectIdValidation } = require('./../middleware/validation.middleware');

exports.addToCart = joi.object({
        productId: joi.string().custom(ObjectIdValidation).required(),
        quantity: joi.number().integer().min(1).required(),
    }).required();

exports.updateUserCart = joi.object({
        productId: joi.string().custom(ObjectIdValidation).required(),
        quantity: joi.number().integer().min(1).required(),
    }).required();

exports.removeFromCart = joi.object({
        productId: joi.string().custom(ObjectIdValidation).required(),
    }).required();

exports.applayCoupon = joi.object({
    name: joi.string().length(8).required(),
}).required();



