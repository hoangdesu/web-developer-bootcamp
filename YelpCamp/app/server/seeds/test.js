const mongoose = require('mongoose');
const { getAllCitiesData, descriptors, places } = require('./seedHelpers');
const { loremIpsum } = require('lorem-ipsum');

const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review');

mongoose.set('strictQuery', true);
const dbName = 'yelp-camp';
const URI = `mongodb://localhost:27017/${dbName}`;
mongoose
    .connect(URI)
    .then(() => {
        console.log(`Mongoose: connected to db "${dbName}"`);
        // resetDb();
    })
    .catch(e => console.error.bind(console, 'connection error:'));

async function test() {
    console.log('inside');
    const users = await User.countDocuments();
    console.log("🚀 ~ file: test.js:23 ~ test ~ users:", users)
}

test();