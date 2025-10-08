const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

// POST /api/auth/signup
router.post("/signup", authController.signup);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
