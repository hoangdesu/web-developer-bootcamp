const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    console.log('Received a request');
    res.render('home');
});

app.get('/lucky', (req, res) => {
    const randNum = Math.floor(Math.random() * 100) + 1;
    const name = 'Brian';
    res.render('lucky', { rand: randNum, name });
});


app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

