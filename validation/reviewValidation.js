const Joi = require('joi');

const Schema=Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
})

module.exports= Schema;