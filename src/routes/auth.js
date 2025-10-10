const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const asyncHandler = require("express-async-handler");

router.post("/signup", asyncHandler(authController.signup));

router.post("/login", asyncHandler(authController.login));

module.exports = router;
