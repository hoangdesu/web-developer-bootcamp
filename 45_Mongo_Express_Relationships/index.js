const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const Product = require('./models/product');
const Farm = require('./models/farm');

const PORT = 3000;
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const db = 'expressFarmStand';
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

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
