const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../../configs/auth");

const userController = require("./user.controller");

router.get("/login", userController.renderLoginPage);
router.get("/register", userController.renderSignupPage);

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser);

router.get("/verify", userController.verifyAccount);

router.get("/forgot-password", userController.renderForgotPasswordPage);
router.post("/forgot-password", userController.forgotPassword);

router.get("/reset-password", userController.renderResetPasswordPage);
router.post("/reset-password", userController.resetPassword);

// How to use http://localhost:3000/users/login/auth/google
router.get("/login/auth/google", userController.loginWithGoogle);
router.get("/login/auth/google/callback", userController.callbackGoogle);

router.get("/profile",ensureAuthenticated, userController.renderProfile);

module.exports = router;
