const { catchAsync } = require('../utilities/helpers');

const Campground = require('../models/campground');
const User = require('../models/user');
const { cloudinary } = require('../configs/cloudinary');
const YelpcampError = require('../utilities/YelpcampError');

const geocodingClient = require('../configs/mapbox');
const CampgroundBuilder = require('../utilities/builders');

const getAllCampgrounds = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
        .populate('author', '_id username')
        .populate('reviews', 'rating')
        .exec();
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
                select: { _id: 1, username: 1, createdAt: 1, updatedAt: 1 }, // select certain fields inside nested populate. 1 for true
            },
            options: { sort: { createdAt: -1 } }, // sort newest review on top
        })
        .exec();

    if (!campground) return next(new YelpcampError(404, 'Campground not found'));

    res.status(200).json(campground);
});

// POST /api/v1/campgrounds
const createCampground = catchAsync(async (req, res, next) => {
    const { title, location, price, description } = req.body.campground;
    let { geometry } = req.body.campground;

    // Authorization
    const author = req.headers.authorization;

    // Uploaded images using cloudinary + multer are stored in req.files obj
    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename,
    }));

    // Using geocoding service in the backend if client doesn't provide geometry object
    if (!geometry) {
        const geoData = await geocodingClient
            .forwardGeocode({
                query: location,
                limit: 1,
            })
            .send();

        geometry = geoData.body?.features?.[0]?.geometry;
        console.log('No geometry from client, using geometry backend:', geometry);
    }

    const newCampground = new CampgroundBuilder()
        .withTitle(title)
        .withPrice(price)
        .withDescription(description)
        .withLocation(location)
        .withGeometry(geometry)
        .withImages(images)
        .withAuthor(author)
        .build();

    console.log('newCampground', newCampground);

    const savedCampground = await Campground(newCampground).save();
    console.log('saved campground: ', savedCampground);

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
    const { title, location, price, description } = req.body.campground;
    const author = req.headers.authorization;
    const { reOrderedImages, imagesToDelete, newImages } = req.body;

    let { geometry } = req.body.campground;

    console.log('req.body', req.body);

    // Add new images campground
    let extendedCampgroundImages = reOrderedImages;
    if (newImages.length > 0) {
        extendedCampgroundImages = reOrderedImages.concat(newImages);
    }

    // Using geocoding service in the backend if client doesn't provide geometry object
    if (!geometry) {
        const geoData = await geocodingClient
            .forwardGeocode({
                query: location,
                limit: 1,
            })
            .send();
        geometry = geoData.body?.features?.[0]?.geometry;
        console.log('No geometry from client, using geometry backend:', geometry);
    }

    const campground = new CampgroundBuilder()
        .withTitle(title)
        .withPrice(price)
        .withDescription(description)
        .withLocation(location)
        .withGeometry(geometry)
        .withImages(extendedCampgroundImages)
        .withAuthor(author)
        .build();

    // Update campground data
    const updatedCampground = await Campground.findByIdAndUpdate(id, campground, {
        runValidators: true,
        new: true,
    });

    if (!updatedCampground) return next(new YelpcampError(400, 'Failed saving campground'));

    // Delete images stored in cloudinary
    if (imagesToDelete.length > 0) {
        // await imagesToDelete.forEach(image => cloudinary.uploader.destroy(image)); // method 1
        const deletedRes = await cloudinary.api.delete_resources(imagesToDelete, {
            type: 'upload',
            resource_type: 'image',
        });

        if (!deletedRes)
            return next(new YelpcampError(500, 'Failed deleting images on Cloudinary'));
    }

    return res.status(200).json(updatedCampground._id);
});

const deleteCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);

    if (!deletedCampground) {
        return next(new YelpcampError(404, 'Delete failed. Campground not found'));
    }

    console.log('deletedCampground', deletedCampground);

    // Also delete the campground associated with this user's campgrounds array
    await User.findByIdAndUpdate(deletedCampground.author, { $pull: { campgrounds: id } });

    // Delete a campground should delete all images from cloudinary
    const deletedRes = await cloudinary.api.delete_resources(
        deletedCampground.images.map(img => img.filename),
        {
            type: 'upload',
            resource_type: 'image',
        },
    );

    console.log('Deleted images from cloudinary:', deletedRes);

    if (!deletedRes) return next(new YelpcampError(500, 'Failed deleting images on Cloudinary'));

    return res.status(200).send('campground deleted');
});

const searchCampgrounds = catchAsync(async (req, res) => {
    const { q: query } = req.query;
    if (!query) return res.json([]);

    // query by title or location
    const campgrounds = await Campground.find({
        $or: [{ title: new RegExp(query, 'gi') }, { location: new RegExp(query, 'gi') }], // get all occurrences (g), be case insensitive (i)
    })
        .populate('reviews')
        .exec();

    res.status(200).json(campgrounds);
});

module.exports = {
    getAllCampgrounds,
    getACampground,
    createCampground,
    editCampground,
    deleteCampground,
    searchCampgrounds,
};
