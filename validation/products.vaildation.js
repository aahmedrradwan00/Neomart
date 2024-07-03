const joi = require('joi');
const { ObjectIdValidation } = require('./../middleware/validation.middleware');

exports.createProduct = joi.object({
        name: joi.string().min(3).max(20).required(),
        description: joi.string().min(3).max(100).required(),
        discount: joi.number().integer().min(1).max(70),
        availableItems: joi.number().integer().min(1).required(),
        price: joi.number().integer().min(1).required(),
        category: joi.string().custom(ObjectIdValidation).required(true),
        subcategory: joi.string().custom(ObjectIdValidation).required(true),
        brand: joi.string().custom(ObjectIdValidation).required(true),
    }).required();

exports.updateProduct = joi.object({
        id: joi.string().custom(ObjectIdValidation).required(),
        name: joi.string().min(3).max(20).required(),
        description: joi.string().min(3).max(100).required(),
        discount: joi.number().integer().min(1).max(70),
        availableItems: joi.number().integer().min(1).required(),
        price: joi.number().integer().min(1).required(),
        soldItems: joi.number().integer().min(1),
    }) .required();

exports.deleteProduct = joi.object({ id: joi.string().custom(ObjectIdValidation).required() }).required();
