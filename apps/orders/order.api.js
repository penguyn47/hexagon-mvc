const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const { ensureAuthenticated } = require('../../configs/auth');

router.post('/',ensureAuthenticated, orderController.createOrder);
router.get('/:id',ensureAuthenticated, orderController.getOrderById);
router.put('/:id/status',ensureAuthenticated, orderController.updateOrderStatus);
router.get('/user/:userId',ensureAuthenticated, orderController.getOrdersByUser);
router.get('/:id/products',ensureAuthenticated, orderController.getOrderProducts);

module.exports = router;
