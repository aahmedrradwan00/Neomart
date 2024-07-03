const joi = require('joi');
const {ObjectIdValidation}=require("../middleware/validation.middleware")

exports.createBrand = joi.object({
    name: joi.string().min(3).max(10).required(),
    categories: joi.array().items(joi.string().custom(ObjectIdValidation).required()).required(),
}).required();

exports.updateBrand = joi.object({
    name: joi.string().min(3).max(20).required(),
    id:joi.string().custom(ObjectIdValidation).required(),
}).required();

exports.deleteBrand =joi.object({
    id:joi.string().custom(ObjectIdValidation).required(),
}).required();