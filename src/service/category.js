const { Category, CategoryTranslation } = require("../models");
const ExpressError = require("../utils/expressError");

const categoryService = {
  // Create a new empty category and optionally translations
  create: async ({ translations = [] } = {}) => {
    try {
      

      const category = await Category.create();
      

      if (translations && translations.length) {
        // Normalize incoming translation objects so DB-required field `name` is present
        const toCreate = translations.map((t) => {
          const name = t.name ?? t.title ?? t.text ?? t.value;
          return {
            categoryId: category.id,
            lang: t.lang || t.locale || 'en',
            name,
          };
        });
        

        const invalid = toCreate.filter((t) => !t.name);
        if (invalid.length) {
          console.error('[categoryService] translations missing name field for langs:', invalid.map(i => i.lang));
          throw new ExpressError(`Translations missing required 'name' field for languages: ${invalid.map(i=>i.lang).join(',')}`, 400);
        }

        const created = await CategoryTranslation.bulkCreate(toCreate);
        
      }

      // return category including translations for easier debugging
      const withTranslations = await Category.findByPk(category.id, {
        include: [{ model: CategoryTranslation, as: "translations" }],
      });
      
      return withTranslations;
    } catch (err) {
      console.error("[categoryService] create error:", err && err.message ? err.message : err);
      throw err;
    }
  },

  // Get category by id including translations
  getById: async (id) => {
    if (!id) throw new ExpressError("Category id is required", 400);

    const category = await Category.findByPk(id, {
      include: [{ model: CategoryTranslation, as: "translations" }],
    });

    if (!category) throw new ExpressError("Category not found", 404);

    return category;
  },

  // List categories with optional pagination
  list: async ({ limit = 20, offset = 0 } = {}) => {
    const { rows, count } = await Category.findAndCountAll({
      limit,
      offset,
      include: [{ model: CategoryTranslation, as: "translations" }],
    });
    return { rows, count };
  },

  // Update translations for a category (replacement)
  update: async (id, { translations = [] } = {}) => {
    try {
      

      const category = await Category.findByPk(id);
      if (!category) {
        console.warn("[categoryService] update - category not found:", id);
        throw new ExpressError("Category not found", 404);
      }

      // Simple strategy: delete existing translations and create new ones
      const destroyed = await CategoryTranslation.destroy({ where: { categoryId: id } });
      

      if (translations && translations.length) {
        const toCreate = translations.map((t) => {
          const name = t.name ?? t.title ?? t.text ?? t.value;
          return {
            categoryId: id,
            lang: t.lang || t.locale || 'en',
            name,
          };
        });
        

        const invalid = toCreate.filter((t) => !t.name);
        if (invalid.length) {
          console.error('[categoryService] translations missing name field for langs:', invalid.map(i => i.lang));
          throw new ExpressError(`Translations missing required 'name' field for languages: ${invalid.map(i=>i.lang).join(',')}`, 400);
        }

        const created = await CategoryTranslation.bulkCreate(toCreate);
        
      }

      const result = await Category.findByPk(id, { include: [{ model: CategoryTranslation, as: "translations" }] });
      
      return result;
    } catch (err) {
      console.error("[categoryService] update error:", err && err.message ? err.message : err);
      throw err;
    }
  },

  // Delete category by id (translations cascade)
  delete: async (id) => {
    const category = await Category.findByPk(id);
    if (!category) throw new ExpressError("Category not found", 404);
    await category.destroy();
    return true;
  },
};

module.exports = categoryService;
