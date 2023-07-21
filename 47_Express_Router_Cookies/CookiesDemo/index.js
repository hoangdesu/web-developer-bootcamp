const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;

// sign cookie with a secret
app.use(cookieParser('secret')); // s%3Aprogramming.PbN9UdvJHJGquwCSxKMMqxWAY1plAX%2BhI3rkKIrLKfc
// app.use(cookieParser('idontknow')); // s%3Aprogramming.7lDeo2nJcrUBwBe74am4lEcJU5%2Bu2X4tndgPqSYrCzk

app.get('/setcookies', (req, res) => {
    const { name } = req.query;
    if (name) {
        res.cookie('name', name);
        res.send(`${name} just got a cookie!`)
    } else {
        res.send('No cookie for you :(');
    }
});

app.get('/hi', (req, res) => {
    console.log(req.cookies);
    const { name } = req.cookies;
    name ? res.send(`Hi ${name}`) : res.send('Cookies name not set :(');
});
    
app.get('/signcookie', (req, res) => {
    // set signed option
    res.cookie('love', 'programming', { signed: true });
    res.send('Signed a cookie');
});

app.get('/getsignedcookies', (req, res) => {
    res.send(req.signedCookies);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
