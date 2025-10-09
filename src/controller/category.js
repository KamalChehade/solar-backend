const categoryService = require("../service/category");

const categoryController = {
  // GET /api/categories/:id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoryService.getById(id);
      return res.status(200).json({ success: true, category });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/categories
  list: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 20;
      const offset = parseInt(req.query.offset, 10) || 0;
      const result = await categoryService.list({ limit, offset });
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/categories
  create: async (req, res, next) => {
    try {
      
      const { translations } = req.body;
      const category = await categoryService.create({ translations });
      return res.status(201).json({ success: true, category });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/categories/:id
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const { translations } = req.body;
      const category = await categoryService.update(id, { translations });
      return res.status(200).json({ success: true, category });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/categories/:id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await categoryService.delete(id);
      return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
