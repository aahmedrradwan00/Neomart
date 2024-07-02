const joi = require('joi');

exports.signup = joi
    .object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email({ minDomainSegments: 2 }).required().messages({
            'string.email': 'please enter a valid email',
            'any.required': 'email must be entered',
        }),
        phoneNumber: joi.string().required(),
        password: joi.string().min(8).max(30).required().messages({
            'string.base': 'please enter a valid password',
            'any.required': 'password must be entered',
            'string.min': 'password must be at least 8 characters',
        }),
        confirmPassword: joi.string().valid(joi.ref('password')).required(),
    })
    .required();

exports.activateAccount = joi
    .object({
        token: joi.string().required().messages({ 'string.base': 'this is error in your token' }),
    })
    .required();

exports.login = joi
    .object({
        email: joi.string().email({ minDomainSegments: 2 }).required().messages({
            'string.email': 'please enter a valid email',
            'any.required': 'email must be entered',
        }),
        password: joi.string().min(8).max(30).required().messages({
            'string.base': 'please enter a valid password',
            'any.required': 'password must be entered',
            'string.min': 'password must be at least 8 characters',
        }),
    })
    .required();

exports.logout = joi
    .object({
        token: joi.string().required().messages({ 'string.base': 'this is error in your token' }),
    })
    .required();

exports.forgotPassword = joi
    .object({
        email: joi.string().email({ minDomainSegments: 2 }).required().messages({
            'string.email': 'please enter a valid email',
            'any.required': 'email must be entered',
        }),
    })
    .required();

exports.resetPassword = joi
    .object({
        resetCode: joi.string().required().label('Reset Code'),
        password: joi.string().min(8).max(30).required().messages({
            'string.base': 'please enter a valid password',
            'any.required': 'password must be entered',
            'string.min': 'password must be at least 8 characters',
        }),
        confirmPassword: joi.string().valid(joi.ref('password')).required(),
    })
    .required();
    
exports.updatePassword = joi
    .object({
        currentPassword: joi.string().min(8).max(30).required(),
        password: joi.string().min(8).max(30).required(),
        confirmPassword: joi.string().valid(joi.ref('password')).required(),
    })
    .required();
