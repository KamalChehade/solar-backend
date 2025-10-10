const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const asyncHandler = require("express-async-handler");

// GET /api/categories
router.get("/", asyncHandler(categoryController.list));

// POST /api/categories
router.post("/", asyncHandler(categoryController.create));

// GET /api/categories/:id
router.get("/:id", asyncHandler(categoryController.getById));

// PUT /api/categories/:id
router.put("/:id", asyncHandler(categoryController.update));

// DELETE /api/categories/:id
router.delete("/:id", asyncHandler(categoryController.delete));

module.exports = router;
