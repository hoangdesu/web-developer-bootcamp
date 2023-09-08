const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewSchema = require('../schemas/review');

const YelpcampError = require('../utilities/YelpcampError');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new YelpcampError(400, error);
    next();
};

const isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;

    const author = req.headers.authorization;
    if (!author) return next(new YelpcampError(400, 'Missing Authorization header'));

    const review = await Review.findById(reviewId);
    if (!review) return next(new YelpcampError(404, 'Review not found'));

    const campground = await Campground.findById(review.campground);
    if (!campground) return next(new YelpcampError(404, 'Campground not found'));

    // console.log('--is author', campground.author, author);
    if (!review.author.equals(author))
        return next(
            new YelpcampError(403, "Forbidden! You don't have permission to perform this action"),
        );

    next();
};

module.exports = {
    validateReview,
    isReviewAuthor,
};
