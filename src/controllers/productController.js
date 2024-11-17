const Product = require('../models/product.model');  // Import model Product
const cloudinary = require('../config/cloudinary');

require('dotenv').config();

exports.renderProductsPage = async (req, res) => {
    try {
        const products = await Product.find().lean();

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
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
    }
};

exports.renderSingleProductPage = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
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
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, description, rating, quote } = req.body;
    const images = req.files.map(file => { return file.filename; });

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
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
    }
};
