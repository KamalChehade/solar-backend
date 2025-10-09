const express = require("express");
const router = express.Router();

// Mount auth routes at /api/auth
router.use("/auth", require("./auth"));

// Mount categories routes at /api/categories
router.use("/categories", require("./category"));

router.use("/translations", require("./translations"));

// Mount articles routes at /api/articles
router.use("/articles", require("./article"));

module.exports = router;
