const { TranslationServiceClient } = require("@google-cloud/translate").v3;
const path = require("path");
const fs = require("fs");

// ✅ Load credentials
const credentialsPath = path.join(
  __dirname,
  "plucky-courier-451717-b7-f37cfd955173.json"
);

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

// ✅ Initialize client with explicit credentials
const translationClient = new TranslationServiceClient({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  projectId: credentials.project_id,
});

const projectId = credentials.project_id;
const location = "global";

const translationService = {
  translate: async ({
    q,
    source = "en",
    target = "ar",
    format = "text",
  } = {}) => {
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
