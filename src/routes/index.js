const express = require("express");
const router = express.Router();

// Mount auth routes at /api/auth
router.use("/api/auth", require("./auth"));


module.exports = router;