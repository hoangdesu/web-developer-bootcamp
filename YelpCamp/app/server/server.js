const path = require('path');
const os = require('os');
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';
require('dotenv').config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./configs/logger');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

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
        if (process.env.NODE_ENV === 'dev') {
            console.log(`🚀 [${process.env.NODE_ENV}] Server running at http://localhost:${PORT}`);
        } else {
            console.log(
                `🚀 [${process.env.NODE_ENV}] Server running at http://${os.hostname()}:${PORT}`,
            );
        }
    });
});

// Passport
app.use(session(sessionConfigs));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middlewares
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:4173',
            'http://localhost:3000',
            'https://yelpcamp.hoangdesu.com',
            'https://yelpcamp-hoangdesu.vercel.app',
        ],
    }),
);
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
    mongoSanitize({
        allowDots: true,
        replaceWith: '_',
    }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(logger());

// Route handlers
app.use('/', homeRoutes);
app.use('/api/v1/campgrounds', campgroundRoutes);
app.use('/api/v1/campgrounds/:campgroundId/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reservations', reservationRoutes);
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
