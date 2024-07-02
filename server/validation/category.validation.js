const joi = require('joi');
const {ObjectIdValidation}=require("./../middleware/validation.middleware")

exports.createCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
}).required();

exports.updateCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
    id:joi.string().custom(ObjectIdValidation).required()
}).required();;

exports.deleteCategory=joi.object({
    id:joi.string().custom(ObjectIdValidation).required()
}).required();;