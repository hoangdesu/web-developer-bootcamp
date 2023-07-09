const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    price: Number,
    description: String,
    location: String,
    image: String
});

module.exports = mongoose.model('Campground', campgroundSchema);
