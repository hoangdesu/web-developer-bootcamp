const Joi = require('./extendedJoi');

module.exports = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().sanitizeHTML(),
        location: Joi.string().required().sanitizeHTML(),
        geometry: Joi.object({
            type: Joi.string(),
            coordinates: Joi.array(),
        }),
        price: Joi.number().required().min(0),
        images: Joi.array()
            .items(
                Joi.object({
                    url: Joi.string().required(),
                    filename: Joi.string().required(),
                }),
            )
            .required(),
        description: Joi.string().sanitizeHTML(),
        author: Joi.string().required(),
        reviews: Joi.array(),
        reservations: Joi.array(),
    }).required(),
});
