const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const Product = require('./models/product');
const Farm = require('./models/farm');
const { productCategories } = require('./types');

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

// --- FARM ROUTES

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
    const farm = await Farm.findById(id).populate('products');
    res.render('./farms/farm', { farm });
});

app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
});

// GET /farms/:id/products/new (form)
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('./products/new', { categories: productCategories, farm });
});

// POST /farms/:id/products/
app.post('/farms/:id/products/', async (req, res) => {
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    
    const { id } = req.params;
    const farm = await Farm.findById(id);
    farm.products.push(product);
    await farm.save();

    product.farm = farm;
    await product.save();

    // res.send(farm);
    res.redirect('/farms/' + id);
});



// --- PRODUCT ROUTES
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    // res.send(products);
    res.render('./products/index', { products });
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm');
    res.render('./products/product', { product });
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
