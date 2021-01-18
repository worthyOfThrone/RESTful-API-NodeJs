// VALIDATIONS
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
    const schema = {
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().min(1).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        organisation_name: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};

// Login Validation
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;