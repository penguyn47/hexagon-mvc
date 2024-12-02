const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../configs/auth');

const userController = require('./user.controller');

router.get('/login', userController.renderLoginPage);
router.get('/register', userController.renderSignupPage);

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/logout', userController.logoutUser);


// Route profile
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
router.put('/profile/password', ensureAuthenticated, userController.changePassword);



module.exports = router;