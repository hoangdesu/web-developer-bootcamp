const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const Image = Schema(
    {
        url: { type: String, required: true },
        filename: { type: String, required: true },
    },
    { _id: false },
);

const campgroundSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: Number,
        description: String,
        location: String,
        images: [Image],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
    },
    {
        timestamps: true,
    },
);

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        const resp = await Review.deleteMany({ _id: { $in: campground.reviews } });
        if (resp.acknowledged) console.log(`DELETED ${resp.deletedCount} reviews`);
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);
