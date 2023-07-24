const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const YelpcampError = require('./utilities/YelpcampError');
const { resetDb } = require('./seeds');

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

// Routers
const campgroundRouter = require('./routes/campground');
const reviewRouter = require('./routes/review');

// Express
const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// middlewares

// for testing only
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.get('/resetdb', (req, res) => {
    resetDb();
    res.status(200).send('db has been reset');
});

// Route handlers

app.use('/api/v1/campgrounds', campgroundRouter);
app.use('/api/v1/reviews', reviewRouter);

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
