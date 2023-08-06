const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        plainPassword: {
            type: String,
        },
        campgrounds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Campground'
            }
        ]
    },
    {
        timestamps: true,
    },
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
