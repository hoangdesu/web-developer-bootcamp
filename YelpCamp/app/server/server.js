const path = require('path');
if (!process.env.NODE_ENV)
    throw new Error('Missing .env file. Please set NODE_ENV to one of these values: dev | prod');
require('dotenv').config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./configs/logger');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const YelpcampError = require('./utilities/YelpcampError');
const sessionConfigs = require('./configs/sessionConfigs');

// Routers
const homeRoutes = require('./routes/home');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservation');
const testingRoutes = require('./routes/testing');

// Models
const User = require('./models/user');

// Express
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));


// Mongoose
mongoose.set('strictQuery', true);
const URI = `${process.env.MONGO_URI}`;
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`💾 [mongoose] Connected to db "${process.env.DB_NAME}"`);
    // ensure connection to db before starting for serverless functions
    app.listen(PORT, () => {
        console.log(`🚀 [${process.env.NODE_ENV}] Server running at http://localhost:${PORT}`);
    });
});
// app.use(cors( { credentials: true }));
app.use(cors());


// Passport
app.use(session(sessionConfigs));
app.use(cookieParser());
// app.use(bodyParser());
// app.use(session({ secret: 'TEST '}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middlewares
app.use(express.json());
app.use(methodOverride('_method'));
// app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(
    mongoSanitize({
        allowDots: true,
        replaceWith: '_',
    }),
);
app.use(helmet());
app.use(flash());
app.use(morgan('dev'));
app.use(logger());

// Route handlers
app.use('/', homeRoutes);
app.use('/api/v1/campgrounds', campgroundRoutes);
app.use('/api/v1/campgrounds/:campgroundId/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reservation', reservationRoutes);
app.use('/testing', testingRoutes);

// 404, place after all route handlers
app.all('*', (req, res, next) => {
    next(new YelpcampError(404, 'Route not found'));
});

// error handlers
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong :(' } = err;
    res.status(statusCode).send(message);
});
