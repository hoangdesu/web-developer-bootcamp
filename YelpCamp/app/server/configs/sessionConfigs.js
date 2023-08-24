const MongoStore = require('connect-mongo');
require('dotenv').config();
// if (process.env.NODE_ENV !== 'production') {
// }

module.exports = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret: process.env.SESSION_SECRET,
        },
        dbName: 'yelp-camp',
    }),
};
