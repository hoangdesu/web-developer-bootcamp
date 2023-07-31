const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.statics.findAndValidate = async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);
