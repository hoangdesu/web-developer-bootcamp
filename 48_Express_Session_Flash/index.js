const express = require('express');
const app = express();
const cookiesParser = require('cookie-parser');
const session = require('express-session');

const PORT = 3000;

app.use(
    session({
        secret: 'hehe',
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(cookiesParser());

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


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
