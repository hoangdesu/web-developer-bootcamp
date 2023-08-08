const { catchAsync } = require('../utilities/helpers');

const Campground = require('../models/campground');
const User = require('../models/user');

const getAllCamgrounds = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({}).populate('author', '_id username').exec();
    return res.status(200).json(campgrounds);
});

const getACampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate('author', '_id username email')
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
                model: 'User',
                select: { _id: 1, username: 1 }, // select certain fields inside nested populate. 1 for true
            },
            options: { sort: { createdAt: -1 } },
        }) // sort newest review on top
        .exec();
    res.status(200).json(campground);
});

// POST /api/v1/campgrounds
const createCampground = catchAsync(async (req, res, next) => {
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
});

// PUT /api/v1/campgrounds/:id
const editCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { campground } = req.body;

    const updatedCampground = await Campground.findByIdAndUpdate(id, campground, {
        runValidators: true,
        new: true,
    });

    if (!updatedCampground) return next(new YelpcampError(400, 'Failed saving campground'));

    res.status(200).json(updatedCampground._id);
});

const deleteCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);

    if (!deletedCampground) {
        return next(new YelpcampError(404, 'Delete failed. Campground not found'));
    }

    // delete all campgrounds associated with this user
    const userId = deletedCampground.author;
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { campgrounds: id } });
    console.log('updatedUser', updatedUser);

    res.status(200).send('campground deleted');
});

const addMockCampground = catchAsync(async (req, res, next) => {
    const campground = new Campground({
        title: 'Mock campground',
        price: 123,
        description: 'just mocking',
        location: 'Saigon',
        image: 'https://images.unsplash.com/photo-1568576550491-185584b2145a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    });
    await campground.save();
    res.status(200).send('saved new campground');
});

module.exports = {
    getAllCamgrounds,
    getACampground,
    createCampground,
    editCampground,
    deleteCampground,
    addMockCampground,
};
