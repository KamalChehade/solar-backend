const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");

// GET /api/categories
router.get("/", categoryController.list);

// POST /api/categories
router.post("/", categoryController.create);

// GET /api/categories/:id
router.get("/:id", categoryController.getById);

// PUT /api/categories/:id
router.put("/:id", categoryController.update);

// DELETE /api/categories/:id
router.delete("/:id", categoryController.delete);

module.exports = router;
