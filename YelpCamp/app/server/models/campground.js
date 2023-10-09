const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = Schema(
    {
        url: { type: String, required: [true, 'Missing image url'] },
        filename: { type: String, required: [true, 'Missing image filename'] },
    },
    { _id: false },
);

// virtual: create a computed value "thumbnail", not stored in db
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// to include in API response
ImageSchema.set('toJSON', { getters: true });

const pointSchema = Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

const campgroundSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Missing campground title'],
        },
        price: { type: Number, required: [true, 'Missing campground price'] },
        description: String,
        location: { type: String, required: [true, 'Missing campground location'] },
        geometry: {
            type: pointSchema,
        },
        images: [ImageSchema],
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
        reservations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Reservation',
            },
        ],
    },
    {
        timestamps: true,
    },
);

// Delete all reviews associated with a campground
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        const resp = await Review.deleteMany({ _id: { $in: campground.reviews } });
        if (resp.acknowledged) console.log(`DELETED ${resp.deletedCount} reviews`);
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);
