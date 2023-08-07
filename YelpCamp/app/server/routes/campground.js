const express = require('express');
const router = express.Router();
const { catchAsync } = require('../utilities/helpers');
const { campgroundSchema } = require('../schemas');
const YelpcampError = require('../utilities/YelpcampError');
const requiresLoggedIn = require('../middlewares/requiresLoggedIn');

// Models
const Campground = require('../models/campground');
const User = require('../models/user');

// middlewares
const validateCampground = (req, res, next) => {
    // validating request body with Joi before extracting data
    const { error: validationError } = campgroundSchema.validate(req.body);
    // console.log('validationError:', validationError);
    if (validationError) throw new YelpcampError(500, validationError);
    next(); // dont forget!
};

const isAuthor = async (req, res, next) => {
    console.log('-- is author');
    const { id } = req.params;

    const author = req.headers.authorization;
    if (!author) return next(new YelpcampError(400, 'Missing Authorization header'));

    const campground = await Campground.findById(id);

    if (!campground) return next(new YelpcampError(404, 'Campground now found'));
    if (!campground.author.equals(author)) return next(new YelpcampError(403, "Forbidden! You don't have permission to perform this action"));
    next();
};

router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({}).populate('author', '_id username').exec();
        return res.status(200).json(campgrounds);
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
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id)
            .populate('author')
            .populate({ path: 'reviews', options: { sort: { createdAt: -1 } } }) // sort newest review on top
            .exec();
        res.status(200).json(campground);
    }),
);

// POST /api/v1/campgrounds
router.post(
    `/`,
    requiresLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { title, location, price, image, description } = req.body.campground;

        // Authorization
        const author = req.headers.authorization;
        // console.log('headers:', req.headers, author);

        const savedCampground = await Campground({
            title,
            location,
            price,
            image,
            description,
            author,
        }).save();

        // save new campground to user's campgrounds list
        const user = await User.findById(author);
        if (!user) return next(new YelpcampError(404, 'User not found'));

        user.campgrounds.push(savedCampground._id);
        await user.save();

        if (!savedCampground) return next(new YelpcampError(500, 'Failed saving campground'));
        res.status(201).json(savedCampground._id);
    }),
);

// PUT /api/v1/campgrounds/:id
router.put(
    `/:id`,
    requiresLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res, next) => {
        // console.log('\n--editing campground:');
        const { id } = req.params;
        const { campground } = req.body;
        // const author = req.headers.authorization;

        // check if campground exists, extract author field
        // console.log('campground:', newCampgroundData);
        // const campground = await Campground.findById(campgroundId);

        // if (!campground) return next(new YelpcampError(404, 'Campground now found'));

        // if (campground._id ===)
        // console.log('author:', campground.author.toString(), author, campground.author.equals(author));
        // if (!campground.author.equals(author)) {
        //     return next(new YelpcampError(403, "Forbidden, you don't have permission to edit campground"));
        // }

        // return next(new YelpcampError(405, 'Stop'))

        const updatedCampground = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });

        if (!updatedCampground) return next(new YelpcampError(400, 'Failed saving campground'));

        res.status(200).json(updatedCampground._id);
    }),
);

router.delete(
    `/:id`,
    requiresLoggedIn,
    isAuthor,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const deletedCampground = await Campground.findByIdAndDelete(id);

        if (!deletedCampground) {
            return next(new YelpcampError(404, 'Delete failed. Campground not found'));
        }

        const authorId = deletedCampground.author;
        const updatedUser = await User.findByIdAndUpdate(authorId, { $pull: { campgrounds: id } });
        
        console.log('updatedUser', updatedUser);
        res.status(200).send('campground deleted');
    }),
);

module.exports = router;
