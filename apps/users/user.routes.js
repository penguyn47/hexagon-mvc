const express = require('express');
const router = express.Router();

const userController = require('./user.controller');

router.get('/login', userController.renderLoginPage);
router.get('/register', userController.renderSignupPage);

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/logout', userController.logoutUser);


// Middleware kiểm tra đăng nhập
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        // Người dùng đã đăng nhập
        return next();
    }
    // Người dùng chưa đăng nhập, chuyển hướng đến login
    res.redirect('/users/login');
}

// Route profile, thêm middleware ensureAuthenticated
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', {
        currentView: 'profile',
        name: req.user?.username,
        profileImg: req.user?.picture,
        email: req.user?.email,
        firstName: req.user?.firstName,
        lastName: req.user?.lastName
    });
});

// Route update profile
router.put('/profile', ensureAuthenticated, userController.updateUser);



module.exports = router;