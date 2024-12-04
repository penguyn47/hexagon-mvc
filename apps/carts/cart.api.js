const express = require('express');
const cartController = require('./cart.controller');
const router = express.Router();
const { ensureAuthenticated } = require('../../configs/auth');

// Định nghĩa các tuyến API liên quan đến giỏ hàng
router.post('/create',ensureAuthenticated, cartController.createCartIfNotExists);
router.post('/add',ensureAuthenticated, cartController.addToCart);
router.get('/',ensureAuthenticated, cartController.getCartItems);
router.put('/update',ensureAuthenticated, cartController.updateCartItemQuantity);
router.delete('/remove/:productId',ensureAuthenticated, cartController.removeFromCart);
router.delete('/clear',ensureAuthenticated, cartController.clearCart);

module.exports = router;
