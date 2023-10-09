const YelpcampError = require('../utilities/YelpcampError');

const Campground = require('../models/campground');
const { newCampgroundSchema, existingCampgroundSchema } = require('../schemas/campground');
const CampgroundBuilder = require('../utilities/builders');

// validating request body with Joi before extracting data
const validateNewCampground = (req, res, next) => {
    const { title, location, price, description, geometry } = req.body.campground;
    const author = req.headers.authorization;
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const campground = new CampgroundBuilder()
        .withTitle(title)
        .withPrice(price)
        .withDescription(description)
        .withLocation(location)
        .withGeometry(geometry)
        .withImages(images)
        .withAuthor(author)
        .build();

    const body = { campground };

    const { error: validationError } = newCampgroundSchema.validate(body);

    if (validationError) {
        console.log('Campground validation error:', validationError);
        throw new YelpcampError(500, validationError);
    }

    next(); // dont forget!
};

const validateExistingCampground = (req, res, next) => {
    const { title, location, geometry, price, images, description } = req.body.campground;
    const author = req.headers.authorization;
    const { imagesToDelete } = req.body;

    console.log('\n ---body:');
    console.dir(req.body)

    // Parse existing images
    const reOrderedImages = [];
    for (let img of images) {
        try {
            reOrderedImages.push(JSON.parse(img));
        } catch (e) {
            console.log('Error parsing images data', e);
            return next(new YelpcampError(500, 'Error parsing images data'));
        }
    }
    console.log('reOrderedImages', reOrderedImages);

    // this logic sucks. rework this
    // Parse images to delete
    // const imagesToDelete = [];
    // if (typeof imagesToDeleteArray === 'object') {
    //     for (let img of imagesToDeleteArray) {
    //         try {
    //             imagesToDelete.push(JSON.parse(img));
    //         } catch (e) {
    //             console.log('Error parsing images data', e);
    //             return next(new YelpcampError(500, 'Error parsing images data'));
    //         }
    //     }
    // } else if (typeof imagesToDeleteArray === 'string') {
    //     try {
    //         imagesToDelete.push(JSON.parse(imagesToDeleteArray));
    //     } catch (e) {
    //         console.log('Error parsing images data', e);
    //         return next(new YelpcampError(500, 'Error parsing images data'));
    //     }
    // }


    // console.log('--typeof imagesToDeleteArray', typeof imagesToDeleteArray);
    // console.log('-- imagesToDeleteArray', imagesToDeleteArray);

    

    const campground = new CampgroundBuilder()
        .withTitle(title)
        .withPrice(price)
        .withDescription(description)
        .withLocation(location)
        .withGeometry(geometry)
        .withImages(reOrderedImages)
        .withAuthor(author)
        .build();

    console.log('-- req.files', req.files);
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));

    console.log('\n--typeof imagesToDelete', typeof imagesToDelete);
    console.log('-- imagesToDelete', imagesToDelete);
    console.log('-- newImages', newImages);

    console.log('\n');

    const { error: validationError } = existingCampgroundSchema.validate({
        campground,
        newImages, // build from req.files, after uploading ok to cloudinary
        imagesToDelete,
    });

    if (validationError) {
        console.log('Error validating campground:', validationError);
        throw new YelpcampError(500, validationError);
    }

    console.log('VALIDATED OK, NO ERROR!!');

    next();
};

const isCampgroundAuthor = async (req, res, next) => {
    // console.log('-- is author');
    const { id } = req.params;

    const author = req.headers.authorization;
    if (!author) return next(new YelpcampError(400, 'Missing Authorization header'));

    const campground = await Campground.findById(id);
    if (!campground) return next(new YelpcampError(404, 'Campground now found'));
    if (!campground.author.equals(author))
        return next(
            new YelpcampError(403, "Forbidden! You don't have permission to perform this action"),
        );
    next();
};

module.exports = {
    validateNewCampground,
    validateExistingCampground,
    isCampgroundAuthor,
};
