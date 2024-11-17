const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.renderProductsPage);
router.get('/:id', productController.renderSingleProductPage);

module.exports = router;
