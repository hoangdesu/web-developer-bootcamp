const mongoose = require('mongoose');
const { getAllCitiesData, descriptors, places } = require('./seedHelpers');
const { loremIpsum } = require('lorem-ipsum');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { cloudinary } = require('../configs/cloudinary');

const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review');
const geocodingClient = require('../configs/mapbox');

// mongoose.set('strictQuery', true);
// const dbName = 'yelp-camp';
// const URI = `mongodb://localhost:27017/${dbName}`;
// mongoose
//     .connect(URI)
//     .then(() => {
//         console.log(`Mongoose: connected to db "${dbName}"`);
//         resetDb();
//     })
//     .catch(e => console.error.bind(console, 'connection error:'));

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDatabase = async totalCamps => {
    // drop all campgrounds
    await Campground.deleteMany({}).then(res => console.log(res));

    const cities = getAllCitiesData();

    console.log('🚀 ~ file: index.js:52 ~ seedDatabase ~ totalCamps:', totalCamps);

    for (let i = 0; i < totalCamps; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const { city, admin_name } = cities[randomIndex];

        const randomUserIndex = Math.floor(Math.random() * (await User.countDocuments()));
        const randomUser = await User.findOne().skip(randomUserIndex).exec();

        console.log('user:', randomUserIndex, randomUser.username);

        const randomImages = async () => {
            const { resources } = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'YelpCamp', // add your folder
            });
            console.log('🚀 ~ file: index.js:71 ~ randomImages ~ res:', resources);

            const imgs = [];
            const IMAGES = resources.map(r => ({ url: r.url, filename: r.public_id }));
            // console.log('🚀 ~ file: index.js:79 ~ randomImages ~ IMAGES:', IMAGES);

            for (let j = 0; j < Math.floor(Math.random() * IMAGES.length) + 1; j++) {
                imgs.push(sample(IMAGES));
            }

            // console.log('🚀 ~ file: index.js:87 ~ randomImages ~ imgs:', imgs.length, imgs);
            return imgs;
        };

        // console.log('random images:', await randomImages());

        // to be updated
        const newCampground = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: (Math.random() * 50).toFixed(1),
            description: loremIpsum(),
            location: `${city}, ${admin_name}`,
            // image: 'https://source.unsplash.com/collection/1114848', // random photo in "camping" collection
            author: randomUser._id,
            images: await randomImages(),
        });

        const geoData = await geocodingClient
            .forwardGeocode({
                query: newCampground.location,
                limit: 1,
            })
            .send();
        newCampground.geometry = geoData.body.features[0].geometry;
        await newCampground.save();

        // randomImages().then(res => {
        //     console.log('inside random images', res);
        // });
        console.log('🚀 ~ file: index.js:101 ~ seedDatabase ~ newCampground:', newCampground);

        randomUser.campgrounds.push(newCampground);
        await randomUser.save();

        // generate random reviews
        for (let j = 0; j < Math.floor(Math.random() * 10) + 1; j++) {
            const randomUserIndex = Math.floor(Math.random() * (await User.countDocuments()));
            const randomUser = await User.findOne().skip(randomUserIndex).exec();
            const review = new Review({
                comment: loremIpsum(),
                rating: Math.floor(Math.random() * 4) + 1,
                author: randomUser._id,
                campground: newCampground._id,
            });
            newCampground.reviews.push(review);
            await newCampground.save();
            await review.save();
        }

        console.log('saved:', city, admin_name);
        cities.splice(randomIndex, 1); // remove to avoid duplication
        console.log('remaining:', cities.length);
    }
};

// can invoke this script via http://localhost:3001/resetdb
module.exports.resetDb = async dbCounts => {
    seedDatabase(dbCounts).then(() => {
        console.log('seeding done!');
    });
};

// seedDatabase().then(() => {
//     console.log('seeding done!');
//     mongoose.connection.close();
// });
