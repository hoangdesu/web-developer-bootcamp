const mongoose = require('mongoose');
const { getAllCitiesData, descriptors, places } = require('./seedHelpers');

const Campground = require('../models/campground');

mongoose.set('strictQuery', true);
const dbName = 'yelp-camp';
const URI = `mongodb://localhost:27017/${dbName}`;
mongoose.connect(URI)
    .then(() => {
        console.log(`Mongoose: connected to db "${dbName}"`);
    })
    .catch(e => console.error.bind(console, 'connection error:'));

// Campground.find({}).then(d => console.log(d));


const sample = (arr) => (arr[Math.floor(Math.random() * arr.length)]);

const seedDatabase = async () => {
    Campground.deleteMany({}).then(res => console.log(res));
    
    const cities = getAllCitiesData();

    const totalCamps = 12;
    
    for (let i = 0; i <= totalCamps; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const { city, admin_name } = cities[randomIndex];

        // to be updated
        await new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: (Math.random() * 50).toFixed(2),
            description: 'campground description placeholder',
            location: `${city}, ${admin_name}`,
            image: 'https://source.unsplash.com/collection/1114848' // random photo in "camping" collection
        }).save();

        console.log('saved:', city, admin_name);
        cities.splice(randomIndex, 1); // remove to avoid duplication
        console.log('remaining:', cities.length);
    }
}

seedDatabase().then(() => {
    console.log('seeding done!');
    mongoose.connection.close();
});
