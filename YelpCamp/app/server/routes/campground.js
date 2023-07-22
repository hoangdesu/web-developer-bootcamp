const express = require('express');
const route = express.Router();
const { catchAsync } = require('../utilities/helpers');
const { campgroundSchema } = require('../schemas');
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
        const { campground } = req.body;
        const { title, location, price, image, description } = campground;

        const savedCampground = await Campground({
            title,
            location,
            price,
            image,
            description,
        }).save();

        console.log('savedCampground:', savedCampground);

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

// POST /campgrounds/:id/reviews
route.post(
    '/:id/reviews',
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);

        // need refactor
        const { review } = req.body;
        console.log('review', review);
        const newReview = new Review(review);
        campground.reviews.push(newReview);
        await campground.save();
        await newReview.save();

        const reviews = await Review.find({});
        res.status(200).redirect(`/campgrounds/${id}`);
    }),
);

module.exports = route;
