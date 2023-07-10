const Joi = require('joi');

const registerUserSchema = Joi.object({
    body: Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('admin', 'customer').required()
    }).required().options({stripUnknown: true})
}).options({stripUnknown: true});

module.exports = registerUserSchema;