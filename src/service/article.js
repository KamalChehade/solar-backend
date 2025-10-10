const { Article, ArticleTranslation } = require("../models");
const ExpressError = require("../utils/expressError");
const path = require("path");
const fs = require("fs").promises;

const articleService = {
  /* -----------------------------------------------
     CREATE ARTICLE (with translations)
  ------------------------------------------------ */
  create: async ({
    translations = [],
    cover_image = null,
    video_url = null,
    categoryId,
    published_date = null,
    reading_time = null,
    created_by_id = null,
  } = {}) => {
    if (!categoryId) throw new ExpressError("categoryId is required", 400);

    // Normalize cover_image to filename only (in case a path was passed)
    let coverFilename = cover_image ? path.basename(String(cover_image)) : null;

    // Create article
    const article = await Article.create({
      cover_image: coverFilename,
      video_url,
      categoryId,
      published_date,
      reading_time,
      created_by_id,
    });

    // Create translations
    if (translations && translations.length) {
      const toCreate = translations.map((t) => {
        const title = t.title ?? t.name ?? t.heading;
        const excerpt = t.excerpt ?? t.summary ?? t.short;
        const content = t.content ?? t.body ?? t.text;
        const author = t.author ?? null;

        return {
          articleId: article.id,
          lang: t.lang || t.locale || "en",
          title,
          excerpt,
          content,
          author,
        };
      });

      const invalid = toCreate.filter((t) => !t.title || !t.excerpt || !t.content);
      if (invalid.length) throw new ExpressError("Translations missing required fields (title/excerpt/content)", 400);

      await ArticleTranslation.bulkCreate(toCreate);
    }

    return await Article.findByPk(article.id, { include: [{ model: ArticleTranslation, as: "translations" }] });
  },

  /* -----------------------------------------------
     GET ARTICLE BY ID
  ------------------------------------------------ */
  getById: async (id) => {
    if (!id) throw new ExpressError("Article id is required", 400);
    const article = await Article.findByPk(id, { include: [{ model: ArticleTranslation, as: "translations" }] });
    if (!article) throw new ExpressError("Article not found", 404);
    return article;
  },

  /* -----------------------------------------------
     LIST ALL ARTICLES (paginated)
  ------------------------------------------------ */
  list: async ({ limit = 20, offset = 0 } = {}) => {
    const { rows, count } = await Article.findAndCountAll({ limit, offset, include: [{ model: ArticleTranslation, as: "translations" }] });
    return { rows, count };
  },

  /* -----------------------------------------------
     UPDATE ARTICLE (with translations)
  ------------------------------------------------ */
  update: async (
    id,
    {
      translations = [],
      cover_image = undefined,
      video_url = undefined,
      published_date = undefined,
      reading_time = undefined,
      categoryId = undefined,           // ✅ include it

    } = {}
  ) => {
    // ✅ Log the raw payload received
    console.log('🟡 [ArticleService.update] Received payload:', {
      id,
      translations,
      cover_image,
      video_url,
      published_date,
      reading_time,
      categoryId,                       // ✅ now you’ll see it

    });

    const article = await Article.findByPk(id);
    if (!article) throw new ExpressError("Article not found", 404);

    // Normalize cover_image to filename only when provided
    let coverFilename = undefined;
    if (cover_image !== undefined && cover_image !== null) {
      coverFilename = path.basename(String(cover_image));
    }

    // Only update fields that are actually provided
    const updateData = {};
    if (
      cover_image !== undefined &&
      coverFilename !== undefined &&
      coverFilename !== null &&
      coverFilename !== ""
    )
      updateData.cover_image = coverFilename;
    if (video_url !== undefined) updateData.video_url = video_url;
    if (published_date !== undefined) updateData.published_date = published_date;
    if (reading_time !== undefined) updateData.reading_time = reading_time;

    // ✅ handle categoryId updates too
    if (categoryId !== undefined && categoryId !== null) {
      // optional: coerce to number if your controller passes strings
      const cat = Number.isFinite(Number(categoryId)) ? Number(categoryId) : categoryId;
      updateData.categoryId = cat;
    }
    // ✅ Log what will actually be updated in the Article table
    console.log('🛠️ [ArticleService.update] Computed updateData:', updateData);

    if (Object.keys(updateData).length > 0) {
      // if we're replacing the cover image, remove the old file from disk
      if (updateData.cover_image && article.cover_image && article.cover_image !== updateData.cover_image) {
        const oldPath = path.join(__dirname, '..', 'uploads', String(article.cover_image));
        console.log('[ArticleService.update] deleting old cover file:', oldPath);
        try {
          await fs.unlink(oldPath);
        } catch (e) {
          // log but don't block the update if file missing
          console.warn('[ArticleService.update] failed to delete old cover file (ignored):', e && e.message ? e.message : e);
        }
      }

      console.log('[ArticleService.update] updating article with:', updateData);
      await article.update(updateData);
    }

    // Merge translations: update existing, insert new, and allow partial updates
    if (translations && translations.length) {
      const existing = await ArticleTranslation.findAll({ where: { articleId: id } });
      const existingByLang = existing.reduce((acc, t) => {
        acc[t.lang] = t;
        return acc;
      }, {});

      const toUpsert = [];

      for (const t of translations) {
        const lang = t.lang || t.locale || "en";
        const existingRow = existingByLang[lang];

        const title =
          t.title ?? t.name ?? t.heading ?? (existingRow && existingRow.title);
        const excerpt =
          t.excerpt ?? t.summary ?? t.short ?? (existingRow && existingRow.excerpt);
        const content =
          t.content ?? t.body ?? t.text ?? (existingRow && existingRow.content);
        const author = t.author ?? (existingRow && existingRow.author) ?? null;

        if (!title || !excerpt || !content) {
          throw new ExpressError(
            `Translations for lang='${lang}' missing required fields after merge`,
            400
          );
        }

        if (existingRow) {
          await existingRow.update({ title, excerpt, content, author });
        } else {
          toUpsert.push({ articleId: id, lang, title, excerpt, content, author });
        }
      }

      if (toUpsert.length) await ArticleTranslation.bulkCreate(toUpsert);
    }

    const result = await Article.findByPk(id, {
      include: [{ model: ArticleTranslation, as: "translations" }],
    });

    // ✅ Log the final response (what will be returned to frontend)
    console.log('✅ [ArticleService.update] Final response:', result?.toJSON?.() || result);

    return result;
  },

  /* -----------------------------------------------
     DELETE ARTICLE
  ------------------------------------------------ */
  delete: async (id) => {
    const article = await Article.findByPk(id);
    if (!article) throw new ExpressError("Article not found", 404);

    // delete cover image file if present
    if (article.cover_image) {
      const filePath = path.join(__dirname, '..', 'uploads', String(article.cover_image));
      console.log('[ArticleService.delete] deleting cover file:', filePath);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.warn('[ArticleService.delete] failed to delete cover file (ignored):', e && e.message ? e.message : e);
      }
    }

    await article.destroy();
    return true;
  },
};

module.exports = articleService;
