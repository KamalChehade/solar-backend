const express = require('express');
const router = express.Router();
const articleController = require('../controller/article');
const articleUpload = require('../middlewares/articleUpload');

// GET /solar-api/articles
router.get('/', articleController.list);

// POST /solar-api/articles (multipart/form-data with optional cover_image)
router.post('/', articleUpload.single('cover_image'), articleController.create);

// GET /solar-api/articles/:id
router.get('/:id', articleController.getById);

// PUT /solar-api/articles/:id
router.put('/:id', articleUpload.single('cover_image'), articleController.update);

// DELETE /solar-api/articles/:id
router.delete('/:id', articleController.delete);

module.exports = router;
