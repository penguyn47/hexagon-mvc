// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Các route liên quan đến người dùng
router.post('/', userController.createUser);           // POST /users

module.exports = router;
