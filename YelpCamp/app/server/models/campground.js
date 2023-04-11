const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String
});

module.exports = mongoose.model('Campground', campgroundSchema);
