const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const reservationSchema = new Schema(
    {
        bookedBy: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        campground: {
            type: ObjectId,
            ref: 'Campground',
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        nights: {
            type: Number,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        discountCode: {
            type: String,
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'CANCELLED'],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Reservation', reservationSchema);

// TODO: change shape of reservation. Also change in related files
// - rename totalPrice to totalAmount
// - added DISCOUNT CODE field
