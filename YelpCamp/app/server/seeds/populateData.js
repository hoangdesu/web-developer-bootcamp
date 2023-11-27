const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.dev') });
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const BASE_URL = 'http://localhost:3001/api/v1';
const mongoose = require('mongoose');

const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review');
const Reservation = require('../models/reservation');
const geocodingClient = require('../configs/mapbox');
const { cloudinary } = require('../configs/cloudinary');

const connectToDB = () => {
    mongoose.set('strictQuery', true);
    const dbName = 'yelp-camp';
    const URI = `mongodb://localhost:27017/${dbName}`;
    mongoose
        .connect(URI)
        .then(() => {
            console.log(`Mongoose: connected to db "${dbName}"`);
        })
        .catch(e => console.error.bind(console, 'connection error:'));
};

const populateUsers = users => {
    for (let user of users) {
        const { username, email, password } = user;
        axios.post(`${BASE_URL}/users`, { username, email, password });
        console.log('adding user:', user);
    }
    console.log(`populated ${users.length} users`);
};

const uploadImage = async imagePath => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
        // use_filename: true,
        unique_filename: true,
        // overwrite: true,
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(result);
        return result.public_id;
    } catch (error) {
        console.error(error);
    }
};

const populateCampgrounds = async campgrounds => {
    console.log(campgrounds);

    for (let campground of campgrounds) {
        const { title, price, location, description } = campground;

        const geoData = await geocodingClient
            .forwardGeocode({
                query: location,
                limit: 1,
            })
            .send();

        const geometry = geoData.body?.features?.[0]?.geometry;

        const randomUserIndex = Math.floor(Math.random() * (await User.countDocuments()));
        const author = await User.findOne().skip(randomUserIndex).exec();

        const newCampground = new Campground({
            title,
            price,
            description,
            location,
            author,
            images: [
                {
                    url: 'http://res.cloudinary.com/hoangdesu/image/upload/v1696967972/YelpCamp/ayoxm5nzkhx1gc15cw2v.jpg',
                    filename:
                        'http://res.cloudinary.com/hoangdesu/image/upload/v1696967972/YelpCamp/ayoxm5nzkhx1gc15cw2v.jpg',
                },
            ],
            geometry,
        });

        await newCampground.save();
        await author.campgrounds.push(newCampground);
        await author.save();
    }
};

const dropDB = async () => {
    await Campground.deleteMany({});
    console.log('dropped all campgrounds');
    await User.deleteMany({});
    console.log('dropped all users');
    await Review.deleteMany({});
    console.log('dropped all reviews');
    await Reservation.deleteMany({});
    console.log('dropped all reservations');
    await mongoose.connection.db.dropCollection('sessions');
    console.log('dropped all sessions');
    mongoose.connection.close();
};

const main = async () => {
    connectToDB();

    // const ans = prompt(
    //     'This action will drop all databases before populating new data. Are you sure to continue? [y/N]: ',
    // );
    // if (ans !== 'y') {
    //     console.log('bye');
    //     return;
    // }

    await dropDB();
    // populateUsers(data.users);

    // populateCampgrounds(data.campgrounds);

    // mongoose.connection.close();
};

main();

const uploadImages = () => {
    fs.readdirSync(path.resolve(__dirname, './images/')).forEach(folder => {
        console.log(folder, path.resolve(__dirname, folder));
        const filePaths = path.resolve(__dirname, './images/' + folder);
        fs.readdirSync(filePaths).forEach(file => {
            // console.log('filepath:', filePaths)
            // console.log('file:', file)
            const imagePath = filePaths + '/' + file;
            // console.log('imagepath:', imagePath);
            cloudinary.uploader.upload(imagePath).then(res => console.log('uploadres:', res));
            // uploadImage(imagePath)
        });
    });
};

// const imagePath = path.resolve(__dirname, './images/1/snorlax.png');
// cloudinary.uploader.upload(imagePath).then(res => console.log(res))
