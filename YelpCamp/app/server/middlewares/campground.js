const YelpcampError = require('../utilities/YelpcampError');

const Campground = require('../models/campground');
const campgroundSchema = require('../schemas/campground');
const CampgroundBuilder = require('../utilities/builders');

// validating request body with Joi before extracting data
const validateCampground = (req, res, next) => {
    const { title, location, price, description, geometry } = req.body.campground;
    const author = req.headers.authorization;
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const campground = new CampgroundBuilder()
        .withTitle(title)
        .withPrice(price)
        .withDescription(description)
        .withLocation(location)
        .withGeometry(geometry)
        .withImages(images)
        .withAuthor(author)
        .withReviews([])
        .withReservations([])
        .build();

    const body = { campground };

    const { error: validationError } = campgroundSchema.validate(body);

    if (validationError) {
        console.log('Campground validation error:', validationError);
        throw new YelpcampError(500, validationError);
    }

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
