const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');


// Mongoose
mongoose.set('strictQuery', true);
const dbName = 'yelp-camp';
const URI = `mongodb://localhost:27017/${dbName}`;
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Mongoose: connected to db "${dbName}"`);
});


// Model
const Campground = require('./models/campground');


// Express
const PORT = 3001;
const app = express();
const API_V1 = '/api/v1';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// app.use((req, res, next) => {
//     console.log('got a request!');
//     return next();
// })


// testing
app.get('/', (req, res) => {
    // console.log('got a req');
    // res.send('hi hehe!');
    res.json({ message: 'good' });
});

app.get('/api/v1/hi', (req, res) => {
    console.log('here');
    const { name } = req.query;
    let msg = 'hello world';
    if (name) {
        msg = 'hello ' + name;
    }
    res.json({ message: msg });
});


// Route handlers



app.get(`${API_V1}/campgrounds`, async (req, res) => {
    const { id } = req.query;
    if (id) {
        console.log('has id');
        const cg = await Campground.findById(id);
        console.log(cg.location);
        return;
    } else {
        return res.json(await Campground.find({}));
    }
});

app.get(`${API_V1}/make-campground`, async (req, res) => {
    const campground = new Campground({
        title: 'Mock campground',
        price: 123,
        description: 'just mocking',
        location: 'Saigon'
    });
    await campground.save();
    res.status(200).send('saved new campground');
});

app.get(`${API_V1}/campgrounds`, async (req, res) => {
    const { id } = req.query;
    const data = await Campground.find({ id });
    // res.send(`found: ${data.title}`);
});



app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
