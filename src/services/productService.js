const Product = require('../models/product.model');
const Tag = require('../models/tag.model');

const getAllProducts = async () => {
    try {
        const products = await Product.find().lean();
        return products;
    } catch (error) {
        throw new Error("Error when get all products");
    }
};

const getById = async (id) => {
    try {
        const product = await Product.findById(id);
        return product;
    } catch (error) {
        throw new Error("Error when get product by id");
    }
}

const createProduct = async (productData) => {
    const { name, price, description, rating, quote, images } = productData;

    const product = new Product({
        name,
        price,
        images,
        description,
        rating,
        quote,
    });

    try {
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw new Error('Error when create new product: ' + error.message);
    }
};

const deleteProduct = async (productId) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            throw new Error('Product not found');
        }
        return deletedProduct;
    } catch (error) {
        throw new Error('Error when delete product: ' + error.message);
    }
};

const addTagsToProduct = async (productId, tagNames) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const tags = await Tag.find({ 'name': { $in: tagNames } });
        if (tags.length !== tagNames.length) {
            throw new Error('Some tags are invalid');
        }

        const tagIds = tags.map(tag => tag._id);

        product.tags.push(...tagIds);
        await product.save();

        return product;
    } catch (error) {
        throw error;
    }
};

const getProductsWithPaging = async (skip, limit) => {
    return await Product.find().skip(skip).limit(limit).lean();
};

const countAllProducts = async () => {
    return await Product.countDocuments();
};

module.exports = {
    getAllProducts,
    getById,
    createProduct,
    deleteProduct,
    addTagsToProduct,
    getProductsWithPaging,
    countAllProducts,
};