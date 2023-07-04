const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amountPer: {
        value: {
            type: Number,
            default: 100,
            min: 0
        },
        unit: {
            type: String,
            default: 'grams'
        }
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    protein: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['meat', 'fruit', 'vegetable', 'dairy', 'fish', 'others']
    }
}, {
    collection: 'food'
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
