const mongoose = require('mongoose');
const { getAllCitiesData } = require('./seedHelpers');

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

const seedDatabase = async () => {
    Campground.deleteMany({}).then(res => console.log(res));
    
    const cities = getAllCitiesData();
    for (let i = 0; i <= 52; i++) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        const { city, admin_name } = cities[randomIndex];
        
        // to be fixed
        await new Campground({
            title: 'aaaa',
            price: 0,
            description: 'bbb',
            location: `${city}, ${admin_name}`
        }).save();

        console.log('saved:', city, admin_name);
        cities.splice(randomIndex, 1); // remove to avoid duplication
        console.log('remaining:', cities.length);
    }

    // Campground.

}

seedDatabase();