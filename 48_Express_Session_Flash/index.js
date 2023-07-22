const express = require('express');
const app = express();
const cookiesParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const flash = require('connect-flash');

const PORT = 3000;

app.use(
    session({
        cookie: { maxAge: 86400000 },
        secret: 'hehe',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore({
            checkPeriod: 86400000, // prune expired entries every 24h
        }),
    }),
);
app.use(cookiesParser());
app.use(flash());

// flash middleware
app.use((req, res, next) => {
    res.locals.info = req.flash('info');
    next();
});

app.get('/pageviews', (req, res) => {
    if (!req.session.count) req.session.count = 0;
    req.session.count++;
    res.send(`- You have viewed this page ${req.session.count} times <br>- This session id: ${req.cookies['connect.sid']}`);
});

app.get('/register', (req, res) => {
    const { username } = req.query;
    req.session.username = username;
    res.redirect('/hi');
});

app.get('/hi', (req, res) => {
    const { username } = req.session;
    if (username) {
        res.send(`Hi ${username}!`);
    } else {
        res.send(`You are not registered`);
    }
});

app.get('/flash', (req, res) => {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('info', 'Flash is back!');
    res.redirect('/afterflash');
});

app.get('/afterflash', (req, res) => {
    // Get an array of flash messages by passing the key to req.flash()
    const flashArray = req.flash('info');
    console.log(flashArray);
    const msg = flashArray[0];
    // res.send(`Flash info message: ${msg}`);

    // access from res.locals object
    res.send(`Flash info message: ${res.locals.info}`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
