const YelpcampError = require('../utilities/YelpcampError');

const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');

const validateCampground = (req, res, next) => {
    // validating request body with Joi before extracting data
    // console.log('joi:', req.body, req.files)

    // TODO: CREATE BUILD CAMPGROUND OBJECT HANDLER, MIGHT USE FACTORY PATTERN
    const { title, location, price, description } = req.body.campground;
    const author = req.headers.authorization;
    const body = {
        campground: {
            title,
            location,
            price,
            description,
            author
        }
    };

    body.campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    console.log('--- body', body)

    const { error: validationError } = campgroundSchema.validate(body);

    console.log('validationError:', validationError);

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
