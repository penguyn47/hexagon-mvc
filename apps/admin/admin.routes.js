const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const isAdminMiddleware = require('./isAdminMiddleware');

// Trang login admin
router.get('/login', adminController.renderAdminLoginPage);
router.post('/login', adminController.loginAdmin);

router.get('/addProduct', (req, res) => {
    res.render('addProduct', {
        currentView: 'addProduct',
    });
});

// Routes cần quyền admin
router.use(isAdminMiddleware); // Áp dụng middleware cho tất cả route bên dưới
router.get('/users/:id', adminController.getUserById);

module.exports = router;
