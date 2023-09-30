const Joi = require('./extendedJoi');

module.exports = Joi.object({
    reservation: Joi.object({
        bookedBy: Joi.string().required(),
        campground: Joi.string().required(),
        checkIn: Joi.date().required(),
        checkOut: Joi.date().greater(Joi.ref('checkIn')).required(),
        nights: Joi.number().required(),
        guests: Joi.number().required(),
        totalAmount: Joi.number().required(),
        discountCode: Joi.string().allow(''),
        status: Joi.string(),
    }).required(),
});
