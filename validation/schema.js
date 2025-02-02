const Joi = require('joi');
const Schema=Joi.object(
    {
        title: Joi.string().required(),
        description: Joi.string().required(),
        "image.url" : Joi.string().allow("", null),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }
)

module.exports= Schema;