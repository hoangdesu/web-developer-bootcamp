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

// flash middleware
app.use((req, res, next) => {
    res.locals.info = req.flash('info');
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
    const user = await User.findById(user_id);
    res.render('index', { user });
});

app.get('/login', async (req, res) => {
    const { user_id } = req.session;
    // console.log('info:', res.locals.info);
    const user = await User.findById(user_id);
    res.render('login', { user });
});

app.get('/register', async (req, res) => {
    const { user_id } = req.session;
    const user = await User.findById(user_id);
    res.render('register', { user });
});

app.get('/secret', requireLoggedin, async (req, res) => {
    const { user_id } = req.session;
    const user = await User.findById(user_id);
    res.render('secret', { user, user_id });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (await User.findOne({ username })) {
        req.flash('info', 'username already exists');
        res.redirect('/register');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // res.send(user);
    req.session.user_id = user._id;
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
        req.flash('info', 'username doesn\'t exist');
        return res.redirect(302, '/login');
    }

    const matched = await bcrypt.compare(password, user.password);
    console.log('matched:', matched);

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
