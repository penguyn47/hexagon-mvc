const express = require('express');
const router = express.Router();

const productController = require('./product.controller');

router.get('/api/', productController.getProducts);

router.get('/:id', productController.renderSingleProductPage);


module.exports = router;