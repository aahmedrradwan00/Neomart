const joi = require('joi');
const { ObjectIdValidation } = require('./../middleware/validation.middleware');

exports.addToWishlist = joi.object({
    productId: joi.string().custom(ObjectIdValidation).required(),
}).required();

exports.removeFromWishlist = joi.object({
    productId: joi.string().custom(ObjectIdValidation).required(),
}).required();