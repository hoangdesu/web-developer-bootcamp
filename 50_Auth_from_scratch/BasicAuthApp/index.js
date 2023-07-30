const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const User = require('./User');
const bcrypt = require('bcrypt');
const flash = require('flash');
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

const requireLoggedin = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('unauthorized', 'Unauthorized. You need to login first');
        res.redirect('/login');
    } else {
        return next();
    }
} 

app.get('/', (req, res) => {
    const { user_id } = req.session;
    res.render('index', { user_id });
});

app.get('/login', (req, res) => {
    const { user_id } = req.session;
    res.render('login', { user_id });
});

app.get('/register', (req, res) => {
    const { user_id } = req.session;
    res.render('register', { user_id });
});

app.get('/secret', requireLoggedin, async (req, res) => {
    const { user_id } = req.session;
    const user = await User.findById(user_id);
    res.render('secret', { user, user_id });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // res.send(user);
    req.session.user_id = user._id;
    res.redirect('/secret');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) return res.redirect(302, '/login');

    const matched = await bcrypt.compare(password, user.password);
    console.log('matched:', matched);

    if (matched) {
        req.session.user_id = user._id;
        res.redirect('/secret');
    } else {
        res.redirect('/');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.send('/');
});

app.listen(3001, () => {
    console.log('App running at http://localhost:3001');
});
