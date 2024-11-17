const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const upload = require('../middlewares/upload')

router.post('/', upload.array('images', 10), productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/tags/:id', productController.addTagToProduct);

router.post('/tags', productController.addTagController);

module.exports = router;
