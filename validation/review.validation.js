const joi = require('joi');
const { ObjectIdValidation } = require('./../middleware/validation.middleware');

exports.addReview = joi.object({
    productId: joi.string().custom(ObjectIdValidation).required(),
    tittle: joi.string().max(150).required(),
    rating: joi.number().integer().min(1).max(5).required(),
}).required();

exports.updateReview = joi.object({
    id: joi.string().custom(ObjectIdValidation).required(),
    productId: joi.string().custom(ObjectIdValidation).required(),
    tittle: joi.string().max(150),
    rating: joi.number().integer().min(1).max(5),
}).required();

exports.deleteReview = joi.object({
    id: joi.string().custom(ObjectIdValidation).required(),
    productId: joi.string().custom(ObjectIdValidation).required(),
}).required();