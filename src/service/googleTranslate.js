/********************************************************************
 * Google Translation Service (replacement for Lecto/LibreTranslate)
 * Uses @google-cloud/translate v3
 ********************************************************************/
const { TranslationServiceClient } = require("@google-cloud/translate").v3;
const path = require("path");

// ✅ Load credentials automatically
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "plucky-courier-451717-b7-8350751af0e4.json");

// Initialize Google Translation client
const translationClient = new TranslationServiceClient();

// ✅ Project setup
const projectId = "plucky-courier-451717-b7";
const location = "global";

/**
 * Unified translation service.
 * @param {Object} options
 * @param {string|string[]} options.q - Text or array of texts to translate
 * @param {string} [options.source="en"] - Source language
 * @param {string} [options.target="ar"] - Target language
 * @param {string} [options.format="text"] - "text" or "html"
 * @returns {Promise<object>} - Translation result
 */
const translationService = {
  translate: async ({
    q,
    source = "en",
    target = "ar",
    format = "text",
  } = {}) => {
    if (!q) throw new Error("Missing required field: q");
    if (!target) throw new Error("Missing required field: target");

    // Support single or multiple texts
    const contents = Array.isArray(q) ? q : [q];

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents,
      mimeType: format === "html" ? "text/html" : "text/plain",
      sourceLanguageCode: source,
      targetLanguageCode: target,
    };

    try {
      const [response] = await translationClient.translateText(request);
      const translations = response.translations.map((t) => t.translatedText);

      // Match old structure for backward compatibility
      return {
        translatedText:
          translations.length === 1 ? translations[0] : translations,
        sourceLanguage: source,
        targetLanguage: target,
        raw: response,
      };
    } catch (err) {
      const message = err.details || err.message || "Unknown translation error";
      const error = new Error(`Google Translation API error: ${message}`);
      error.status = err.code || 500;
      error.raw = err;
      throw error;
    }
  },
};

module.exports = translationService;
