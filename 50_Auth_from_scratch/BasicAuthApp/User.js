const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Missing username'],
    },
    password: {
        type: String,
        required: [true, 'Missing password'],
    },
});

module.exports = mongoose.model('User', userSchema);
