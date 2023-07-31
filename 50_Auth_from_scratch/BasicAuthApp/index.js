const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const User = require('./User');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const db = 'basic-auth-app';
const URI = `mongodb://localhost:27017/${db}`;
mongoose.set('strictQuery', true);
mongoose
    .connect(URI)
    .then(() => {
        console.log(`🚀 Connected to ${db} db`);
    })
    .catch(err => {
        console.error(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(
    session({
        cookie: { maxAge: 86400000 },
        secret: 'hehe',
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(flash());
app.use(express.urlencoded({ extended: true }));

// flash and get user middleware
app.use(async (req, res, next) => {
    res.locals.info = req.flash('info');
    const { user_id } = req.session;
    res.locals.user = await User.findById(user_id);
    next();
});

const requireLoggedin = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('info', 'Unauthorized. You need to login first');
        res.redirect('/login');
    } else {
        return next();
    }
};

app.get('/', async (req, res) => {
    const { user_id } = req.session;
    // const user = await User.findById(user_id);
    res.render('index');
});

app.get('/login', async (req, res) => {
    const { user_id } = req.session;
    // console.log('info:', res.locals.info);
    // const user = await User.findById(user_id);
    res.render('login');
});

app.get('/register', async (req, res) => {
    // const { user_id } = req.session;
    // const user = await User.findById(user_id);
    res.render('register');
});

app.get('/secret', requireLoggedin, async (req, res) => {
    // const { user_id } = req.session;
    // const user = await User.findById(user_id);
    res.render('secret');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (await User.findOne({ username })) {
        req.flash('info', 'username already exists');
        res.redirect('/register');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password }); // use middleware to hash password before saving to db
    await user.save();

    // store logged in user into sesssion
    req.session.user_id = user._id;
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
        req.flash('info', "username doesn't exist");
        return res.redirect(302, '/login');
    }

    const matched = await bcrypt.compare(password, user.password);
    console.log('matched:', matched);

    // could use static methods
    // const validatedUser = await User.findAndValidate(username, password);

    if (matched) {
        req.session.user_id = user._id;
        res.redirect('/secret');
    } else {
        req.flash('info', 'Wrong password');
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/');
});

app.listen(3001, () => {
    console.log('App running at http://localhost:3001');
});
