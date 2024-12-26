const express = require('express');
const orderController = require('./order.controller');
const router = express.Router();
const { ensureAuthenticated } = require('../../configs/auth');

router.get('/',ensureAuthenticated, orderController.renderOrdersPage);

router.post("/payment/success", orderController.paymentSuccess);

router.get("/payment/:id", ensureAuthenticated, orderController.paymentMethod);

module.exports = router;
