const Joi = require('joi');

const updateUserSchema = Joi.object({
    headers: Joi.object({
        authorization: Joi.string().pattern(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/).required()
    }).required().options({stripUnknown: true}),
    body: Joi.object({
      first_name: Joi.string().min(1).required(),
      last_name: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
    }).required().options({stripUnknown: true})
}).options({stripUnknown: true});

module.exports = updateUserSchema;