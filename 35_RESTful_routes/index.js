const express = require('express');
const app = express();
const path = require('path');
const { rawListeners } = require('process');
const PORT = 3001;

// must include middlewares to parse data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// index
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('OK!');
});

// GET: data is sent via query string
app.get('/sushi', (req, res) => {
    // console.log(req.query);
    const { type, qty } = req.query;
    res.send(`GET /sushi: received order of ${qty} ${type} sushi.`);
});

// POST: data is sent via request body
app.post('/sushi', (req, res) => {
    // console.log(req.body);
    const { type, qty } = req.body;
    res.send(`POST /sushi: received order of ${qty} ${type} sushi.`)
});


// LISTEN
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
