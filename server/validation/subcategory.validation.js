const joi = require('joi');
const {ObjectIdValidation}=require("./../middleware/validation.middleware")

exports.allSubcategory = joi.object({
    categoryId: joi.string().custom(ObjectIdValidation),
}).required();

exports.createSubCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
    categoryId:joi.string().custom(ObjectIdValidation).required()
}).required();

exports.updateSubCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
    id:joi.string().custom(ObjectIdValidation).required(),
    categoryId: joi.string().custom(ObjectIdValidation),
}).required();

exports.deleteSubCategory=joi.object({
    id:joi.string().custom(ObjectIdValidation).required(),
    categoryId: joi.string().custom(ObjectIdValidation),
}).required();