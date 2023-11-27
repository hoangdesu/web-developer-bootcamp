const MongoStore = require('connect-mongo');
require('dotenv').config();

const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    dbName: process.env.DB_NAME,
    ttl: 8 * 24 * 60 * 60, // 8 days
    autoRemove: 'native', // expired sessions will be removed from collection
});

mongoStore.on('error', function (e) {
    console.log('session store error:', e);
});

module.exports = {
    name: 'sessionID',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true, // only allows cookies with https. Turn on in production
    },
    store: mongoStore,
};
