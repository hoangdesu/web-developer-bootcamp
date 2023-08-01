const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const YelpcampError = require('./utilities/YelpcampError');
const { resetDb } = require('./seeds');

// Mongoose
mongoose.set('strictQuery', true);
const URI = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Mongoose: connected to db "${process.env.DB_NAME}"`);
});

// Routers
const campgroundRouter = require('./routes/campground');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

// Models
const Review = require('./models/review');
const User = require('./models/user');

// Express
const PORT = 3001;
const app = express();

const sessionConfigs = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfigs));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for testing only
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

app.get('/resetdb', (req, res) => {
    resetDb();
    res.status(200).send('db has been reset');
});

app.get('/reviews', async (req, res, next) => {
    res.status(200).json(await Review.find({}));
});

// Route handlers
app.use('/api/v1/campgrounds', campgroundRouter);
app.use('/api/v1/campgrounds/:campgroundId/reviews', reviewRouter);
app.use('/api/v1/users', userRouter);

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
