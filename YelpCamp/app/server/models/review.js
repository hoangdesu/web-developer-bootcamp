const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true, 'Missing review text'],
    },
    rating: {
        type: Number,
        required: [true, 'Missing raring'],
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }
});

module.exports = mongoose.model('Review', reviewSchema);
