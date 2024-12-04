const express = require('express');
const cartController = require('./cart.controller');
const router = express.Router();
const { ensureAuthenticated } = require('../../configs/auth');

// Định nghĩa các tuyến API liên quan đến giỏ hàng
router.get('/',ensureAuthenticated, cartController.renderCartPage);

module.exports = router;
