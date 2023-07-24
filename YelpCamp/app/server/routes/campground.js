const express = require('express');
const route = express.Router();
const { catchAsync } = require('../utilities/helpers');
const { campgroundSchema, reviewSchema } = require('../schemas');
const YelpcampError = require('../utilities/YelpcampError');

// Models
const Campground = require('../models/campground');
const Review = require('../models/review');

// middlewares
const validateCampground = (req, res, next) => {
    // validating request body with Joi before extracting data
    const { error: validationError } = campgroundSchema.validate(req.body);
    console.log('validationError:', validationError);
    if (validationError) throw new YelpcampError(400, validationError);
    next(); // dont forget!
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) throw new YelpcampError(400, error);
    next();
};

route.get(
    '/',
    catchAsync(async (req, res) => {
        return res.status(200).json(await Campground.find({}));
    }),
);

route.get(
    `/make-campground`,
    catchAsync(async (req, res, next) => {
        const campground = new Campground({
            title: 'Mock campground',
            price: 123,
            description: 'just mocking',
            location: 'Saigon',
            image: 'https://images.unsplash.com/photo-1568576550491-185584b2145a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        });
        await campground.save();
        res.status(200).send('saved new campground');
    }),
);

route.get(
    `/:id`,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate('reviews').exec();
        res.status(200).json(campground);
    }),
);

route.post(
    `/`,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { title, location, price, image, description } = req.body.campground;

        const savedCampground = await Campground({
            title,
            location,
            price,
            image,
            description,
        }).save();

        if (savedCampground) {
            res.status(200).json(savedCampground._id);
        } else {
            return next(new YelpcampError(400, 'Failed saving campground'));
        }
    }),
);

route.put(
    `/:id`,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { campground } = req.body;

        await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
        // TODO: REFACTOR TO RETURN A JSON FOR CLIENT REDIRECT, NOT SERVER
        res.status(200).redirect(`/campgrounds/${id}`);
    }),
);

route.delete(
    `/:id`,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const deletedCampground = await Campground.findByIdAndDelete(id);
        if (!deletedCampground) {
            return next(new YelpcampError(404, 'delete failed. campground not found'));
        }
        res.status(200).send('campground deleted');
    }),
);

// -- HANDLERS FOR REVIEWS --
// POST /campgrounds/:id/reviews
route.post(
    '/:id/reviews',
    validateReview,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);

        const review = new Review(req.body.review);
        campground.reviews.push(review);
        review.campground = campground;

        await campground.save();
        await review.save();

        res.status(200).json({ status: 'ok' });
    }),
);

// DELETE /campgrounds/:campgroundId/reviews/:reviewId
route.delete(
    '/:campgroundId/reviews/:reviewId',
    catchAsync(async (req, res, next) => {
        const { campgroundId, reviewId } = req.params;

        await Campground.findByIdAndUpdate(campgroundId, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        res.send(200).json({ status: 'ok' });
    }),
);

module.exports = route;
