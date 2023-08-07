const express = require('express');
const router = express.Router({ mergeParams: true });
const { catchAsync } = require('../utilities/helpers');
const { reviewSchema } = require('../schemas');
const requiresLoggedIn = require('../middlewares/requiresLoggedIn');

const YelpcampError = require('../utilities/YelpcampError');

// Models
const Review = require('../models/review');
const Campground = require('../models/campground');
const User = require('../models/user');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new YelpcampError(400, error);
    next();
};

const isAuthor = async (req, res, next) => {
    const { reviewId } = req.params;

    const author = req.headers.authorization;
    if (!author) return next(new YelpcampError(400, 'Missing Authorization header'));

    const review = await Review.findById(reviewId);
    if (!review) return next(new YelpcampError(404, 'Review not found'));

    const campground = await Campground.findById(review.campground);
    if (!campground) return next(new YelpcampError(404, 'Campground not found'));

    // console.log('--is author', campground.author, author);
    if (!review.author.equals(author)) return next(new YelpcampError(403, "Forbidden! You don't have permission to perform this action"));
    
    next();
}

// POST /api/v1/campgrounds/:campgroundId/reviews
router.post(
    '/',
    requiresLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const { campgroundId } = req.params;
        const campground = await Campground.findById(campgroundId);

        const authorId = req.headers.authorization;
        
        const user = await User.findById(authorId);
        console.log('user:', user);

        const review = new Review(req.body.review);
        campground.reviews.push(review);
        review.campground = campground;
        review.author = user;
        user.reviews.push(review)
        
        await campground.save();
        await review.save();
        await user.save();

        res.status(200).json({ status: 'ok' });
    }),
);

// DELETE /api/v1/campgrounds/:campgroundId/reviews/:reviewId
router.delete(
    '/:reviewId',
    requiresLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { campgroundId, reviewId } = req.params;
        const author = req.headers.authorization;

        const updatedCampground = await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        const updatedUser = await User.findByIdAndUpdate(author, { $pull: { reviews: reviewId } });
        
        // console.log('delete review:', updatedCampground, deletedReview, updatedUser);

        res.status(200).json({ status: 'ok' });
    }),
);

module.exports = router;
