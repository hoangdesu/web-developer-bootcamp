const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const YelpcampError = require('./utilities/YelpcampError');
const { catchAsync } = require('./utilities/helpers');
const { campgroundSchema } = require('./schemas');

// Mongoose
mongoose.set('strictQuery', true);
const dbName = 'yelp-camp';
const URI = `mongodb://localhost:27017/${dbName}`;
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Mongoose: connected to db "${dbName}"`);
});

// Model
const Campground = require('./models/campground');

// Express
const PORT = 3001;
const app = express();
const API_V1 = '/api/v1';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// middlewares
const validateCampground = (req, res, next) => {
    // validating request body with Joi before extracting data
    const { error: validationError } = campgroundSchema.validate(req.body);
    console.log('validationError:', validationError);
    if (validationError) throw new YelpcampError(400, validationError); 
    next(); // dont forget!
};

// for testing only
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.get('/api/v1/hi', (req, res) => {
    const { name } = req.query;
    let msg = 'hello world';
    if (name) {
        msg = 'hello ' + name;
    }
    res.json({ message: msg });
});

// Route handlers
app.get(
    `${API_V1}/campgrounds`,
    catchAsync(async (req, res) => {
        return res.status(200).json(await Campground.find({}));
    }),
);

app.get(
    `${API_V1}/make-campground`,
    catchAsync(async (req, res, next) => {
        const campground = new Campground({
            title: 'Mock campground',
            price: 123,
            description: 'just mocking',
            location: 'Saigon',
        });
        await campground.save();
        res.status(200).send('saved new campground');
    }),
);

app.get(
    `${API_V1}/campgrounds/:id`,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).exec();
        res.status(200).json(campground);
    }),
);

app.post(
    `${API_V1}/campgrounds`,
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

app.put(
    `${API_V1}/campgrounds/:id`,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { campground } = req.body;

        await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
        res.status(200).redirect(`/campgrounds/${id}`);
    }),
);

app.delete(`${API_V1}/campgrounds/:id`, async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    if (!deletedCampground) {
        return next(new YelpcampError(404, 'delete failed. campground not found'));
    }
    res.status(200).send('campground deleted');
});

// 404, place after all route handlers
app.all('*', (req, res, next) => {
    next(new YelpcampError(404, 'Page not found'));
});

// error handlers
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong :(' } = err;
    res.status(statusCode).send(message);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
