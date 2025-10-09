const express = require("express");
const router = express.Router();
const translationController = require("../controller/translation");
const asyncHandler = require("express-async-handler");

router.post("/translate", asyncHandler(translationController.translate));

module.exports = router;
