const { catchAsync } = require('../utilities/helpers');

const Campground = require('../models/campground');
const User = require('../models/user');
const { cloudinary } = require('../configs/cloudinary');
const YelpcampError = require('../utilities/YelpcampError');

const geocodingClient = require('../configs/mapbox');
const CampgroundBuilder = require('../utilities/builders');

const VietnamCoordinates = {
    type: 'Point',
    coordinates: [108.7017555, 14.0],
};

const getAllCamgrounds = catchAsync(async (req, res) => {
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

    // const geoData = await geocodingClient
    //     .forwardGeocode({
    //         query: campground.location,
    //         limit: 1,
    //     })
    //     .send();
    // console.log("🚀 ~ file: campground.js:39 ~ getACampground ~ geoData:", geoData.body.features[0].geometry)

    // console.log(campground.images[0].thumbnail);
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
        .withReviews([])
        .withReservations([])
        .build();

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
// TODO: allow editing current images array to set Featured image
// TODO: fix not adding new images will crash
const editCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { campground, deletingImages, featuredImageIndex } = req.body;

    console.log('featuredImageIndex', featuredImageIndex);

    // update campground text data
    const updatedCampground = await Campground.findByIdAndUpdate(id, campground, {
        runValidators: true,
        new: true,
    });

    // add images to array and save to db
    if (req.files) {
        // mapping over image file objects from req.files
        const uploadingImages = req.files.map(file => ({
            url: file.path,
            filename: file.filename,
        }));

        // save to db
        updatedCampground.images.push(...uploadingImages);
        await updatedCampground.save();
    }

    // swapping featured image
    if (featuredImageIndex !== 0) {
        const temp = updatedCampground.images[0];
        updatedCampground.images[0] = updatedCampground.images[featuredImageIndex];
        updatedCampground.images[featuredImageIndex] = temp;
        await updatedCampground.save();
    }

    // deleting images
    if (deletingImages) {
        // delete images stored in cloudinary
        // await deletingImages.forEach(image => cloudinary.uploader.destroy(image)); // method 1
        // method 2
        const deletedRes = await cloudinary.api.delete_resources(deletingImages, {
            type: 'upload',
            resource_type: 'image',
        });
        // .then(res => console.log('deleted:', res));

        if (!deletedRes)
            return next(new YelpcampError(500, 'Failed deleting images on Cloudinary'));

        // delete images in db
        await updatedCampground.updateOne({
            $pull: { images: { filename: { $in: deletingImages } } },
        });

        if (!updatedCampground) return next(new YelpcampError(400, 'Failed deleting images in db'));
    }

    // geometry data
    const geoData = await geocodingClient
        .forwardGeocode({
            query: updatedCampground.location,
            limit: 1,
        })
        .send();
    updatedCampground.geometry = geoData.body?.features?.[0]?.geometry || null;

    await updatedCampground.save();

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

    // TODO: delete a campground will delete all those REVIEWS in a user' reviews array
    console.log('updatedUser', updatedUser);

    // TODO: delete a campground should delete all images from cloudinary

    res.status(200).send('campground deleted');
});

const searchCampgrounds = catchAsync(async (req, res) => {
    const { q: query } = req.query;

    if (!query) return res.send([]);

    const matchedTitles = await Campground.find({ title: new RegExp(query, 'gi') }); // get all occurrences (g), be case insensitive (i)
    const matchedLocations = await Campground.find({ location: new RegExp(query, 'gi') });
    const results = matchedTitles.concat(matchedLocations);
    // TODO: concat might give duplicated results. Remove duplicated
    res.send(results);
});

module.exports = {
    getAllCamgrounds,
    getACampground,
    createCampground,
    editCampground,
    deleteCampground,
    searchCampgrounds,
};
