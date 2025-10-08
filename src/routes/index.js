const express = require("express");
const router = express.Router();

// Mount auth routes at /auth
router.use("/auth", require("./auth"));

module.exports = router;
