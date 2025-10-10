const articleService = require("../service/article");

const articleController = {
  /* -----------------------------------------------
     LIST ALL ARTICLES
  ------------------------------------------------ */
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

  /* -----------------------------------------------
     GET ARTICLE BY ID
  ------------------------------------------------ */
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const article = await articleService.getById(id);
      return res.status(200).json({ success: true, article });
    } catch (err) {
      next(err);
    }
  },

  /* -----------------------------------------------
     CREATE ARTICLE (with translations)
  ------------------------------------------------ */
  create: async (req, res, next) => {
    try {
      const cover_image = req.file ? req.file.filename : undefined;

      const {
        translations,
        video_url,
        categoryId,
        published_date,
        reading_time,
        created_by_id,
      } = req.body;

      // Parse translations if sent as JSON string
      const parsedTranslations =
        typeof translations === "string"
          ? JSON.parse(translations)
          : translations;

      // no debug logs

      const article = await articleService.create({
        translations: parsedTranslations,
        cover_image,
        video_url,
        categoryId,
        published_date,
        reading_time,
        created_by_id,
      });

      // created
      return res.status(201).json({ success: true, article });
    } catch (err) {
      console.error("[ARTICLE CREATE] Error:", err);
      next(err);
    }
  },

  /* -----------------------------------------------
     UPDATE ARTICLE (with translations)
  ------------------------------------------------ */
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const cover_image = req.file ? req.file.filename : undefined;
      const { translations, video_url, published_date, reading_time, categoryId } = req.body;

      const parsedTranslations =
        typeof translations === "string"
          ? JSON.parse(translations)
          : translations;

      // no debug logs

      const article = await articleService.update(id, {
        translations: parsedTranslations,
        cover_image,
        video_url,
        published_date,
        reading_time,
        categoryId,
      });

      // updated
      return res.status(200).json({ success: true, article });
    } catch (err) {
      console.error("[ARTICLE UPDATE] Error:", err);
      next(err);
    }
  },

  /* -----------------------------------------------
     DELETE ARTICLE
  ------------------------------------------------ */
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await articleService.delete(id);
      // deleted
      return res
        .status(200)
        .json({ success: true, message: "Article deleted" });
    } catch (err) {
      console.error("❌ [ARTICLE DELETE] Error:", err);
      next(err);
    }
  },
};

module.exports = articleController;
