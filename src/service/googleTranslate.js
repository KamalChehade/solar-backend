/********************************************************************
 * Google Cloud Translation Service (modern, warning-free)
 * Works with @google-cloud/translate v8+ and Node ≥18
 ********************************************************************/
const { GoogleAuth } = require("google-auth-library");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;
const fs = require("fs");
const path = require("path");

// 🔹 Load service account credentials manually
const keyPath = path.join(__dirname, "plucky-courier-451717-b7-f37cfd955173.json");
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));

// 🔹 Create auth object using explicit credentials (no keyFilename, no warnings)
const auth = new GoogleAuth({
  credentials: {
    client_email: key.client_email,
    private_key: key.private_key,
  },
  projectId: key.project_id,
  scopes: ["https://www.googleapis.com/auth/cloud-translation"],
});

// 🔹 Initialize Translation client with new auth system
const translationClient = new TranslationServiceClient({ auth });

// 🔹 Project config
const projectId = key.project_id;
const location = "global";

// ====================================================================
// Unified Translation Service
// ====================================================================
const translationService = {
  /**
   * Translate text between languages
   * @param {Object} options
   * @param {string|string[]} options.q - text or array of texts
   * @param {string} [options.source='en'] - source language code
   * @param {string} [options.target='ar'] - target language code
   * @param {string} [options.format='text'] - 'text' or 'html'
   * @returns {Promise<{ translatedText: string|string[], sourceLanguage: string, targetLanguage: string }>}
   */
  translate: async ({ q, source = "en", target = "ar", format = "text" } = {}) => {
    if (!q) throw new Error("Missing required field: q");
    if (!target) throw new Error("Missing required field: target");

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
      const result = translations.length === 1 ? translations[0] : translations;

      return {
        translatedText: result,
        sourceLanguage: source,
        targetLanguage: target,
      };
    } catch (err) {
      console.error("❌ Translation failed:", err.message);

      if (err.code === 16) {
        const error = new Error(`Authentication failed. Please ensure:
• Service account has "Cloud Translation API User" role
• Cloud Translation API is enabled
• Project has billing setup`);
        error.status = 401;
        throw error;
      }

      throw err;
    }
  },
};

module.exports = translationService;
