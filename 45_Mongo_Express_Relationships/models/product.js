const mongoose = require('mongoose');
const { Schema } = mongoose;
const { productCategories } = require('../types');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        lowercase: true,
        enum: productCategories,
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm',
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
