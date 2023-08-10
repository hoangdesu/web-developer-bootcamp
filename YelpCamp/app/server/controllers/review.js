const { catchAsync } = require('../utilities/helpers');

const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const YelpcampError = require('../utilities/YelpcampError');

// POST /api/v1/campgrounds/:campgroundId/reviews
const addReview = catchAsync(async (req, res) => {
    const { campgroundId } = req.params;
    const campground = await Campground.findById(campgroundId);

    const authorId = req.headers.authorization;

    const user = await User.findById(authorId);
    // console.log('user:', user);

    const review = new Review(req.body.review);
    review.campground = campground;
    review.author = user;

    campground.reviews.push(review);
    user.reviews.push(review);

    await campground.save();
    await review.save();
    await user.save();

    res.status(200).json({ status: 'ok' });
});

// DELETE /api/v1/campgrounds/:campgroundId/reviews/:reviewId
const deleteReview = catchAsync(async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    const author = req.headers.authorization;

    const updatedCampground = await Campground.findByIdAndUpdate(campgroundId, {
        $pull: { reviews: reviewId },
    });
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    const updatedUser = await User.findByIdAndUpdate(author, { $pull: { reviews: reviewId } });

    // console.log('delete review:', updatedCampground, deletedReview, updatedUser);

    res.status(200).json({ status: 'ok' });
});

const editReview = catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    const { review } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, review, {
        runValidators: true,
        new: true,
    });
    // console.log(updatedReview);

    if (!updatedReview) return next(new YelpcampError(500, 'Failed updating review'));
    res.status(200).json({ status: 'ok' });
});

module.exports = {
    addReview,
    deleteReview,
    editReview,
};
