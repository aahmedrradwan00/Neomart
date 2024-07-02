const joi = require('joi');

exports.createCoupon = joi.object({
    discount: joi.number().integer().options({ convert: false }).min(1).max(70).required(),
    expiredAt:joi.number().integer().options({ convert: false }).required(),
}).required();

exports.updateCoupon = joi
    .object({
        name: joi.string().length(8).required(),
        discount: joi.number().integer().options({ convert: false }).min(1).max(90).required(),
        expiredAt: joi.number().integer().options({ convert: false }).required(),
    })
    .required();

exports.deleteCoupon = joi
    .object({
        name: joi.string().length(8).required(),
    })
    .required();
