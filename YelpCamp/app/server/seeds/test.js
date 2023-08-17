const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { cloudinary } = require('../configs/cloudinary');

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
    console.log('🚀 ~ file: test.js:23 ~ test ~ users:', users);
}

// test();

const testCloudinary = () => {
    console.log('testing cloudinary');
    console.log('env:', process.env.CLOUDINARY_CLOUD_NAME);
    cloudinary.api.resources(
        {
            type: 'upload',
            prefix: 'YelpCamp', // add your folder
        },
        function (error, result) {
            // console.log(result, error);
            console.log(result.resources.length);
        },
    );
};

// testCloudinary();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_BOX_ACCESS_TOKEN });
const testMapbox = async () => {
    const geoData = await geocodingClient
        .forwardGeocode({
            query: 'osaka',
            limit: 3, // optinal, default to 5
        })
        .send();
    // const match = response.body;
    // console.log(geoData.body.features);
    geoData.body.features.forEach(f => {
        console.log(f.geometry.coordinates, f.place_name);
    })
};

testMapbox();
