const mongoose = require('mongoose');
const { getAllCitiesData, descriptors, places } = require('./seedHelpers');

const Campground = require('../models/campground');
const User = require('../models/user');

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

const seedDatabase = async (dbCounts) => {
    Campground.deleteMany({}).then(res => console.log(res));

    const cities = getAllCitiesData();

    const totalCamps = dbCounts || 10;

    for (let i = 0; i <= totalCamps; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const { city, admin_name } = cities[randomIndex];

        const randomUserIndex = Math.floor(Math.random() * 10);
        const randomUser = await User.findOne().skip(randomUserIndex).exec();
        
        console.log('user:', randomUserIndex, randomUser.username)

        // to be updated
        const newCampground = await new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: (Math.random() * 50).toFixed(1),
            description: 'campground description placeholder',
            location: `${city}, ${admin_name}`,
            image: 'https://source.unsplash.com/collection/1114848', // random photo in "camping" collection
            author: randomUser._id,
        }).save();

        randomUser.campgrounds.push(newCampground);
        await randomUser.save();


        console.log('saved:', city, admin_name);
        cities.splice(randomIndex, 1); // remove to avoid duplication
        console.log('remaining:', cities.length);
    }
};

// can invoke this script via http://localhost:3001/resetdb
module.exports.resetDb = (dbCounts) => {
    seedDatabase(dbCounts).then(() => {
        console.log('seeding done!');
    });
};

// seedDatabase().then(() => {
//     console.log('seeding done!');
//     mongoose.connection.close();
// });
