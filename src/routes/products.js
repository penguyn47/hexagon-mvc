// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const upload = require('../middlewares/upload')

// Các route liên quan đến sản phẩm
router.get('/', productController.getAllProducts);       // GET /products
router.get('/:id', productController.getProductById);   // GET /products/:id
router.post('/', upload.array('images', 10), productController.createProduct);      // POST /products
router.delete('/:id', productController.deleteProduct);// DELETE /products/:id

module.exports = router;
