const Joi = require('joi');

const loginSchema = Joi.object({
    body: Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    }).required().options({stripUnknown: true})
}).options({stripUnknown: true});


module.exports = loginSchema;