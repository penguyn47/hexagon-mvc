const express = require('express');
const orderController = require('./order.controller');
const router = express.Router();
const { ensureAuthenticated } = require('../../configs/auth');

router.get('/',ensureAuthenticated, orderController.renderOrdersPage);

router.get("/payment/:id", ensureAuthenticated, orderController.paymentMethod);

router.get(
  "/payment/success/:id",
  orderController.paymentSuccess
);

module.exports = router;
