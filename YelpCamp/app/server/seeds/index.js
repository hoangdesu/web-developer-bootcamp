const mongoose = require('mongoose');
const { getAllCitiesData, descriptors, places } = require('./seedHelpers');
const { loremIpsum } = require('lorem-ipsum');

const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review');

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

const CLOUDINARY_IMAGES = [
    {
        url: 'https://res.cloudinary.com/hoangdesu/image/upload/v1691787713/YelpCamp/p5limcj1xadvcvlwizri.jpg',
        filename: 'YelpCamp/p5limcj1xadvcvlwizri',
    },
    {
        url: 'https://res.cloudinary.com/hoangdesu/image/upload/v1691787713/YelpCamp/ie6bxicx1ngczkpfu0dt.jpg',
        filename: 'YelpCamp/ie6bxicx1ngczkpfu0dt',
    },
    {
        url: 'https://res.cloudinary.com/hoangdesu/image/upload/v1691787713/YelpCamp/unqigoun3yqpridt3xrn.jpg',
        filename: 'YelpCamp/unqigoun3yqpridt3xrn',
    },
    {
        url: 'https://res.cloudinary.com/hoangdesu/image/upload/v1691787713/YelpCamp/y5lqve05juzmowq0ppgp.jpg',
        filename: 'YelpCamp/y5lqve05juzmowq0ppgp',
    },
    {
        url: 'https://res.cloudinary.com/hoangdesu/image/upload/v1691787712/YelpCamp/mhgx6mbtqd0xbsyhelir.jpg',
        filename: 'YelpCamp/mhgx6mbtqd0xbsyhelir',
    },
];

const seedDatabase = async dbCounts => {
    // drop all campgrounds
    await Campground.deleteMany({}).then(res => console.log(res));

    const cities = getAllCitiesData();

    const totalCamps = dbCounts;
    console.log("🚀 ~ file: index.js:52 ~ seedDatabase ~ totalCamps:", totalCamps)

    for (let i = 0; i < totalCamps; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const { city, admin_name } = cities[randomIndex];

        const randomUserIndex = Math.floor(Math.random() * (await User.countDocuments()));
        const randomUser = await User.findOne().skip(randomUserIndex).exec();

        console.log('user:', randomUserIndex, randomUser.username);

        const randomImages = () => {
            const IMAGES = CLOUDINARY_IMAGES;
            const imgs = [];
            for (let j = 0; j < Math.floor(Math.random() * CLOUDINARY_IMAGES.length) + 1; j++) {
                imgs.push(sample(IMAGES));
                IMAGES.splice(randomIndex, 1); // remove to avoid duplication
            }
            return imgs;
        }

        // to be updated
        const newCampground = await new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: (Math.random() * 50).toFixed(1),
            description: 'campground description placeholder',
            location: `${city}, ${admin_name}`,
            // image: 'https://source.unsplash.com/collection/1114848', // random photo in "camping" collection
            author: randomUser._id,
            // images: sample(CLOUDINARY_IMAGES),
            images: randomImages()
        }).save();

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
module.exports.resetDb = dbCounts => {
    seedDatabase(dbCounts).then(() => {
        console.log('seeding done!');
    });
};

// seedDatabase().then(() => {
//     console.log('seeding done!');
//     mongoose.connection.close();
// });
