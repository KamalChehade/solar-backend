const express = require("express");
const router = express.Router();
const translationController = require("../controller/translation");

router.post("/translate", translationController.translate);

module.exports = router;
