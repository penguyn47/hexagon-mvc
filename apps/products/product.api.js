const express = require('express');
const router = express.Router();

const productController = require('./product.controller');

router.get('/:id', productController.getProductById);

router.get('/', productController.getProducts);

router.get('/:id/:page', productController.getProductComment);

module.exports = router;