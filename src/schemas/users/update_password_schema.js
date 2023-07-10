const Joi = require('joi');

const updatePasswordSchema = Joi.object({
    headers: Joi.object({
        authorization: Joi.string().pattern(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required().options({stripUnknown: true}),
    body: Joi.object({
        current_password: Joi.string().min(6).required(),
        new_password: Joi.string().min(6).required()
    }).required().options({stripUnknown: true})
}).options({stripUnknown: true});

module.exports = updatePasswordSchema;