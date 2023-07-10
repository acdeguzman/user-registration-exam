const Joi = require('joi');

const getUserSchema = Joi.object({
    headers: Joi.object({
        authorization: Joi.string().pattern(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).options({stripUnknown: true}),
    params: Joi.object({
        username: Joi.string().min(6).required()
    }).required().options({stripUnknown: true})
}).options({stripUnknown: true});

module.exports = getUserSchema;