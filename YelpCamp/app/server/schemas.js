const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
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
        description: Joi.string(),
        author: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
});
