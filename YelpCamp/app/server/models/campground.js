const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
});

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        const resp = await Review.deleteMany({ _id: { $in: campground.reviews } });
        if (resp.acknowledged) console.log(`DELETED ${resp.deletedCount} reviews`);
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);
