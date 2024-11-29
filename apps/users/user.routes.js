const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

router.get("/login", userController.renderLoginPage);
router.get("/register", userController.renderSignupPage);

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser);

router.get("/verify", userController.verifyAccount);

module.exports = router;
