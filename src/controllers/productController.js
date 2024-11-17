const productService = require('../services/productService');
const tagService = require('../services/tagService')
const cloudinary = require('../config/cloudinary');

require('dotenv').config();

exports.renderProductsPage = async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        products.map((product => {
            product.link = cloudinary.url(product.images[0], {
                crop: 'auto',
                quality: 'auto'
            });
        }))

        res.render('products', {
            sectionTitle: "Our Latest Products",
            sectionDescription: "Check out all of our products.",
            products: products
        });

    } catch (error) {
        res.status(500).json({ message: "Error when get all products", error });
    }
};

exports.renderSingleProductPage = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.getById(id);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        product.images = product.images.map((public_id) =>
            cloudinary.url(public_id, {
                width: 500,
                height: 500,
                crop: 'auto',
                quality: 'auto'
            })
        );

        res.render('singleProduct', product);
    } catch (error) {
        res.status(500).json({ message: "Error when get product by id", error });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, description, rating, quote } = req.body;
    const images = req.files.map(file => file.filename);

    try {
        const savedProduct = await productService.createProduct({
            name,
            price,
            description,
            rating,
            quote,
            images
        });

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await productService.deleteProduct(id);

        res.status(200).json({ message: 'Product successfully deleted' });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

exports.addTagController = async (req, res) => {
    const { name } = req.body;

    try {
        const newTag = await tagService.addNewTag(name);
        res.status(201).json(newTag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addTagToProduct = async (req, res) => {
    const { names } = req.body;
    const { id } = req.params;

    try {
        const updatedProduct = await productService.addTagsToProduct(id, names);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
