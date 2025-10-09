const articleService = require("../service/article");

const articleController = {
  list: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 20;
      const offset = parseInt(req.query.offset, 10) || 0;
      const result = await articleService.list({ limit, offset });
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await articleService.getById(id);
      return res.status(200).json({ success: true, article });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      // multer middleware will set req.file for cover_image
      const cover_image = req.file ? req.file.path : null;
      const { translations, video_url, author, categoryId, published_date, reading_time, created_by_id } = req.body;

      // translations may be sent as JSON string in multipart form
      const parsedTranslations = typeof translations === 'string' ? JSON.parse(translations) : translations;

      const article = await articleService.create({ translations: parsedTranslations, cover_image, video_url, author, categoryId, published_date, reading_time, created_by_id });
      return res.status(201).json({ success: true, article });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const cover_image = req.file ? req.file.path : null;
      const { translations, video_url, author, published_date, reading_time } = req.body;
      const parsedTranslations = typeof translations === 'string' ? JSON.parse(translations) : translations;
      const article = await articleService.update(id, { translations: parsedTranslations, cover_image, video_url, author, published_date, reading_time });
      return res.status(200).json({ success: true, article });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await articleService.delete(id);
      return res.status(200).json({ success: true, message: 'Article deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = articleController;
