const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    quote: {
        type: String,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        default: [],
    }],
    category: {
        type: String,
        default: "",
    },
    brand: {
        type: String,
        default: "",
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
