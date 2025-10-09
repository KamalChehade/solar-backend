const translationService = require("../service/googleTranslate");

const translationController = {
  translate: async (req, res, next) => {
    try {
      const { q, source, target, format } = req.body;

      // Validate input early
      if (!q || !target) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: q and target",
        });
      }

      const result = await translationService.translate({
        q,
        source,
        target,
        format,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("❌ Translation error:", err);

      // If Google returns an error
      return res.status(err.status || 500).json({
        success: false,
        error: err.message || "Translation failed",
      });
    }
  },
};

module.exports = translationController;
