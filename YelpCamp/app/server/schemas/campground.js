const Joi = require('./extendedJoi');

module.exports.newCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().sanitizeHTML(),
        location: Joi.string().required().sanitizeHTML(),
        geometry: Joi.object({
            type: Joi.string(),
            coordinates: Joi.array(),
        }).allow(null),
        price: Joi.number().required().min(0),
        images: Joi.array()
            .items(
                Joi.object({
                    url: Joi.string().required(),
                    filename: Joi.string().required(),
                }),
            )
            .required()
            .min(1),
        description: Joi.string().sanitizeHTML(),
        author: Joi.string().required(),
    }).required(),
});

module.exports.existingCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().sanitizeHTML(),
        location: Joi.string().required().sanitizeHTML(),
        geometry: Joi.object({
            type: Joi.string(),
            coordinates: Joi.array(),
        }).allow(null),
        price: Joi.number().required().min(0),
        images: Joi.array()
            .items(
                Joi.object({
                    url: Joi.string().required(),
                    filename: Joi.string().required(),
                    thumbnail: Joi.string(),
                }),
            )
            .required()
            .min(1),
        description: Joi.string().sanitizeHTML(),
        author: Joi.string().required(),
    }).required(),
    imagesToDelete: Joi.array().items(Joi.string()).required(),
    newImages: Joi.array()
        .items(
            Joi.object({
                url: Joi.string().required(),
                filename: Joi.string().required(),
            }),
        )
        .required(),
});
