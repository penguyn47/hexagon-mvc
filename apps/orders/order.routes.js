const express = require('express');
const orderController = require('./order.controller');
const router = express.Router();
const { ensureAuthenticated } = require('../../configs/auth');

router.get('/',ensureAuthenticated, orderController.renderOrdersPage);

module.exports = router;
