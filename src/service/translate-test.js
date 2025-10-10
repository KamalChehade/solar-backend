const { GoogleAuth } = require("google-auth-library");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;
const path = require("path");

(async () => {
  try {
    const keyFile = path.join(__dirname, "plucky-courier-451717-b7-f37cfd955173.json");

    const auth = new GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/cloud-translation"],
    });

    const translationClient = new TranslationServiceClient({ auth });

    const projectId = "plucky-courier-451717-b7";
    const location = "global";

    const [response] = await translationClient.translateText({
      parent: `projects/${projectId}/locations/${location}`,
      contents: ["Hello world"],
      mimeType: "text/plain",
      sourceLanguageCode: "en",
      targetLanguageCode: "ar",
    });

   } catch (err) {
    console.error("❌ Translation failed:", err.message);
  }
})();
