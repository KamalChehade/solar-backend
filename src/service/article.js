const { Article, ArticleTranslation } = require("../models");
const ExpressError = require("../utils/expressError");

const articleService = {
  create: async ({ translations = [], cover_image = null, video_url = null, author = null, categoryId, published_date = null, reading_time = null, created_by_id = null } = {}) => {
    if (!categoryId) throw new ExpressError("categoryId is required", 400);

    const article = await Article.create({ cover_image, video_url, author, categoryId, published_date, reading_time, created_by_id });

    if (translations && translations.length) {
      const toCreate = translations.map((t) => {
        const title = t.title ?? t.name ?? t.heading;
        const excerpt = t.excerpt ?? t.summary ?? t.short;
        const content = t.content ?? t.body ?? t.text;
        return {
          articleId: article.id,
          lang: t.lang || t.locale || 'en',
          title,
          excerpt,
          content,
        };
      });

      const invalid = toCreate.filter((t) => !t.title || !t.excerpt || !t.content);
      if (invalid.length) throw new ExpressError("Translations missing required fields (title/excerpt/content)", 400);

      await ArticleTranslation.bulkCreate(toCreate);
    }

    return await Article.findByPk(article.id, { include: [{ model: ArticleTranslation, as: "translations" }] });
  },

  getById: async (id) => {
    if (!id) throw new ExpressError("Article id is required", 400);
    const article = await Article.findByPk(id, { include: [{ model: ArticleTranslation, as: "translations" }] });
    if (!article) throw new ExpressError("Article not found", 404);
    return article;
  },

  list: async ({ limit = 20, offset = 0 } = {}) => {
    const { rows, count } = await Article.findAndCountAll({ limit, offset, include: [{ model: ArticleTranslation, as: "translations" }] });
    return { rows, count };
  },

  update: async (id, { translations = [], cover_image = null, video_url = null, author = null, published_date = null, reading_time = null } = {}) => {
    const article = await Article.findByPk(id);
    if (!article) throw new ExpressError("Article not found", 404);

    await article.update({ cover_image, video_url, author, published_date, reading_time });

    if (translations && translations.length) {
      await ArticleTranslation.destroy({ where: { articleId: id } });
      const toCreate = translations.map((t) => ({
        articleId: id,
        lang: t.lang || t.locale || 'en',
        title: t.title ?? t.name ?? t.heading,
        excerpt: t.excerpt ?? t.summary ?? t.short,
        content: t.content ?? t.body ?? t.text,
      }));

      const invalid = toCreate.filter((t) => !t.title || !t.excerpt || !t.content);
      if (invalid.length) throw new ExpressError("Translations missing required fields (title/excerpt/content)", 400);

      await ArticleTranslation.bulkCreate(toCreate);
    }

    return await Article.findByPk(id, { include: [{ model: ArticleTranslation, as: "translations" }] });
  },

  delete: async (id) => {
    const article = await Article.findByPk(id);
    if (!article) throw new ExpressError("Article not found", 404);
    await article.destroy();
    return true;
  },
};

module.exports = articleService;
