const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utilities/helpers');
const { campgroundSchema } = require('../schemas');
const YelpcampError = require('../utilities/YelpcampError');
const { isLoggedIn } = require('../middleware');

// Models
const Campground = require('../models/campground');

// middlewares
const validateCampground = (req, res, next) => {
    // validating request body with Joi before extracting data
    const { error: validationError } = campgroundSchema.validate(req.body);
    console.log('validationError:', validationError);
    if (validationError) throw new YelpcampError(400, validationError);
    next(); // dont forget!
};

router.get(
    '/',
    catchAsync(async (req, res) => {
        return res.status(200).json(await Campground.find({}));
    }),
);

router.get(
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

router.get(
    `/:id`,
    isLoggedIn,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id)
            .populate({ path: 'reviews', options: { sort: { createdAt: -1 } } })
            .exec();
        res.status(200).json(campground);
    }),
);

router.post(
    `/`,
    isLoggedIn,
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

router.put(
    `/:id`,
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { campground } = req.body;

        const updatedCampground = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });

        if (!updatedCampground) {
            return next(new YelpcampError(400, 'Failed saving campground'));
        } else {
            res.status(200).json(updatedCampground._id);
        }
    }),
);

router.delete(
    `/:id`,
    isLoggedIn,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const deletedCampground = await Campground.findByIdAndDelete(id);
        if (!deletedCampground) {
            return next(new YelpcampError(404, 'delete failed. campground not found'));
        }
        res.status(200).send('campground deleted');
    }),
);

module.exports = router;
