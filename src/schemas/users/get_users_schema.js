const Joi = require('joi');

const getUsersSchema = Joi.object({
    headers: Joi.object({
        authorization: Joi.string().pattern(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).options({stripUnknown: true}),
    query: Joi.object({
        role: Joi.string().valid('customer', 'admin'),
        status: Joi.string().valid('active', 'inactive')
    }).options({stripUnknown: true})
}).options({stripUnknown: true});

module.exports = getUsersSchema;