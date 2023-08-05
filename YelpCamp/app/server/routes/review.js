const express = require('express');
const router = express.Router({ mergeParams: true });
const { catchAsync } = require('../utilities/helpers');
const { reviewSchema } = require('../schemas');
const requiresLoggedIn = require('../middlewares/requiresLoggedIn');

const YelpcampError = require('../utilities/YelpcampError');

// Models
const Review = require('../models/review');
const Campground = require('../models/campground');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new YelpcampError(400, error);
    next();
};

// POST /api/v1/campgrounds/:campgroundId/reviews
router.post(
    '/',
    requiresLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const { campgroundId } = req.params;
        const campground = await Campground.findById(campgroundId);

        const review = new Review(req.body.review);
        campground.reviews.push(review);
        review.campground = campground;

        await campground.save();
        await review.save();

        res.status(200).json({ status: 'ok' });
    }),
);

// DELETE /api/v1/campgrounds/:campgroundId/reviews/:reviewId
router.delete(
    '/:reviewId',
    requiresLoggedIn,
    catchAsync(async (req, res) => {
        const { campgroundId, reviewId } = req.params;

        await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ status: 'ok' });
    }),
);

module.exports = router;
