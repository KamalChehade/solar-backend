const express = require('express');
const router = express.Router();
const articleController = require('../controller/article');
const articleUpload = require('../middlewares/articleUpload');
const asyncHandler = require("express-async-handler");

// GET /solar-api/articles
router.get('/', asyncHandler(articleController.list));

// POST /solar-api/articles (multipart/form-data with optional cover_image)
router.post('/', articleUpload.single('cover_image'), asyncHandler(articleController.create));

// GET /solar-api/articles/:id
router.get('/:id', asyncHandler(articleController.getById));

// PUT /solar-api/articles/:id
router.put('/:id', articleUpload.single('cover_image'), asyncHandler(articleController.update));

// DELETE /solar-api/articles/:id
router.delete('/:id', asyncHandler(articleController.delete));

module.exports = router;
