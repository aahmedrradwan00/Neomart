const mongoose = require('mongoose');

//id  validation
exports.ObjectIdValidation = (value, helper) => {
    if (mongoose.Types.ObjectId.isValid(value)) return true;
    return helper.message('Invalid ObjectId!');
};

exports.validation = (schema) => {
    return async (req, res, next) => {
        try {
            const data = { ...req.body, ...req.params, ...req.query };
            await schema.validateAsync(data, { abortEarly: false });
            next();
        } catch (err) {
            const errorMessages = err.details.map((error) => error.message);
            return next(new Error(errorMessages, { cause: 400 }));
        }
    };
};