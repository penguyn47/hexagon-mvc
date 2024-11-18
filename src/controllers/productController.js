const productService = require('../services/productService');
const tagService = require('../services/tagService')
const cloudinary = require('../config/cloudinary');

require('dotenv').config();

const processImages = (images) => {
    return images.map(public_id =>
        cloudinary.url(public_id, {
            crop: 'auto',
            quality: 'auto'
        })
    );
};

exports.renderProductsPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;

        // Search & filters
        const searchQuery = req.query.q || '';
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : '';
        const brandQuery = req.query.brand || '';
        const minRating = req.query.rating || 0;
        const categoryQuery = req.query.category || '';

        const filters = searchQuery.trim()
            ? {
                $or: [
                    { name: { $regex: new RegExp(searchQuery.trim(), 'i') } },
                    { description: { $regex: new RegExp(searchQuery.trim(), 'i') } }
                ]
            }
            : {};
        filters.price = { $gte: minPrice };
        if (req.query.maxPrice) {
            filters.price.$lte = maxPrice;
        }

        if (brandQuery.trim() != '') {
            filters.brand = { $regex: new RegExp(brandQuery.trim(), 'i') };
        }

        if (categoryQuery.trim() != '') {
            filters.category = { $regex: new RegExp(categoryQuery.trim(), 'i') };
        }

        filters.rating = { $gte: minRating };

        const products = await productService.getProductsWithPaging(filters, skip, limit);

        const totalProducts = await productService.countAllProducts(filters);
        const totalPages = Math.ceil(totalProducts / limit);

        products.map((product) => {
            product.link = cloudinary.url(product.images[0], {
                crop: 'auto',
                quality: 'auto'
            });
        });

        res.render('products', {
            sectionTitle: searchQuery
                ? `Results for "${searchQuery}"`
                : "Our Latest Products",
            sectionDescription: searchQuery
                ? `Found ${totalProducts} products matching "${searchQuery}"`
                : "Check out all of our products.",
            products,
            currentPage: page,
            totalPages,
            searchQuery: searchQuery,
            categories: [
                "Womens",
                "Mens",
                "Kids",
                "Accessories",
            ],
            brands: [
                "penguyn47",
            ],
            category: categoryQuery,
            brand: brandQuery,
            minPrice: minPrice,
            maxPrice: maxPrice,
            rating: minRating,
        });

    } catch (error) {
        res.status(500).json({ message: "Error when get products with paging", error });
    }
};

exports.renderSingleProductPage = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.getById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.images = product.images.map((public_id) =>
            cloudinary.url(public_id, {
                crop: 'auto',
                quality: 'auto'
            })
        );

        const relatedProducts = await productService.getRelatedProducts(id);

        relatedProducts.forEach((relatedProduct) => {
            relatedProduct.images = processImages(relatedProduct.images);
        });

        res.render('singleProduct', {
            images: product.images,
            name: product.name,
            price: product.price,
            rating: product.rating,
            description: product.description,
            quote: product.quote,
            relatedProducts: relatedProducts

        });
    } catch (error) {
        res.status(500).json({ message: "Error when get product by id", error });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, description, rating, quote, category, brand } = req.body;
    const images = req.files.map(file => file.filename);

    console.log(category);
    console.log(brand);

    try {
        const savedProduct = await productService.createProduct({
            name,
            price,
            description,
            rating,
            quote,
            images,
            category,
            brand,
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
