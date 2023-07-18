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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

// FARM ROUTES

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('./farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
    res.render('./farms/new');
});

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
});

app.get('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('./farms/farm', { farm });
});

app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
});

// PRODUCT ROUTES

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
