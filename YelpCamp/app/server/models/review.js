const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Missing review text'],
    },
    rating: {
        type: Number,
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }
});

module.exports = mongoose.model('Review', reviewSchema);
