const translationService = require("../service/translation");

const translationController = {
  translate: async (req, res, next) => {
    try {
      const { q, source, target, format } = req.body;
      const result = await translationService.translate({ q, source, target, format });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      // Provide a clearer message for common misconfiguration
      if (err.message && err.message.includes('Endpoint') && err.message.includes('returned HTML')) {
        return res.status(502).json({ success: false, error: 'Translation provider returned HTML - check TRANSLATE_URL or use a supported API endpoint' });
      }
      if (err.message && err.message.includes('Visit https://portal.libretranslate.com')) {
        return res.status(502).json({ success: false, error: 'Translation provider requires an API key. Set TRANSLATE_API_KEY or use another endpoint.' });
      }
      next(err);
    }
  },
};

module.exports = translationController;
