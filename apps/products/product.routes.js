const express = require('express');
const router = express.Router();

const productController = require('./product.controller');

router.get('/', productController.renderMultiProductPage);

router.get('/:id', productController.renderSingleProductPage);


module.exports = router;