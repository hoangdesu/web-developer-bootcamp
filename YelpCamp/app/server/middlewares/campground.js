const YelpcampError = require('../utilities/YelpcampError');

const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');

const validateCampground = (req, res, next) => {
    // validating request body with Joi before extracting data
    const { error: validationError } = campgroundSchema.validate(req.body);
    // console.log('validationError:', validationError);
    if (validationError) throw new YelpcampError(500, validationError);
    next(); // dont forget!
};

const isCampgroundAuthor = async (req, res, next) => {
    // console.log('-- is author');
    const { id } = req.params;

    const author = req.headers.authorization;
    if (!author) return next(new YelpcampError(400, 'Missing Authorization header'));

    const campground = await Campground.findById(id);
    if (!campground) return next(new YelpcampError(404, 'Campground now found'));
    if (!campground.author.equals(author))
        return next(
            new YelpcampError(403, "Forbidden! You don't have permission to perform this action"),
        );
    next();
};

module.exports = {
    validateCampground,
    isCampgroundAuthor,
};
