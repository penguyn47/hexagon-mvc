const express = require("express");
const router = express.Router();

const productRoutes = require("../routes/products");

const userAPIRoutes = require("../api/userAPI");
const productAPIRoutes = require("../api/productAPI");

// Routing
router.get("/", (req, res) => {
  const userName = req.cookies.user_name || "GUEST";
  res.render("home", {
    page: "home",
    userName: userName,
  });
});

// APIs
router.use("/api/products", productAPIRoutes);
router.use("/api/users", userAPIRoutes);

router.get("/about", (req, res) => {
  const userName = req.cookies.user_name || "GUEST";
  res.render("about", {
    page: "about",
    userName: userName,
  });
});

router.get("/contact", (req, res) => {
  const userName = req.cookies.user_name || "GUEST";
  res.render("contact", {
    page: "contact",
    userName: userName,
  });
});

router.use("/products", productRoutes);

router.get("/account", (req, res) => {
  const userName = req.cookies.user_name || "GUEST";
  if (userName !== "GUEST") {
    res.redirect("/");
  } else {
    res.render("account", {
      page: "account",
      type_auth: "log",
    });
  }
});

router.get("/account/login", (req, res) => {
  res.render("account", {
    page: "account",
    type_auth: "log",
  });
});

router.get("/account/register", (req, res) => {
  res.render("account", {
    page: "account",
    type_auth: "reg",
  });
});

router.get("/account/logout", (req, res) => {
  res.clearCookie("user_name");
  res.clearCookie("auth_token");
  res.redirect("/");
});

module.exports = router;
