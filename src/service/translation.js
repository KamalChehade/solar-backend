const translationService = {
  translate: async ({ q, source = "en", target = "ar", format = "text" } = {}) => {
    if (!q || !target) throw new Error("Missing required fields: q and target");

    const envUrl = process.env.TRANSLATE_URL;
    const apiKey = process.env.TRANSLATE_API_KEY;
    const lectoKey = process.env.LECTO_API_KEY;
    const lectoUrl = process.env.LECTO_URL || "https://api.lecto.ai/v1/translate/text";

    // If a Lecto API key is provided, use the Lecto API directly.
    if (lectoKey) {
      // Map our incoming shape to Lecto's text or json endpoints
      const isJsonFormat = format === "json";
      const url = isJsonFormat ? (process.env.LECTO_URL || "https://api.lecto.ai/v1/translate/json") : lectoUrl;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": lectoKey,
      };

      let body;
      if (isJsonFormat) {
        // If q is an object, send as JSON string; if it's already a string, pass through
        const jsonPayload = typeof q === "string" ? q : JSON.stringify(q || {});
        body = JSON.stringify({ to: [target], from: source, json: jsonPayload });
      } else {
        body = JSON.stringify({ texts: [q], to: [target], from: source });
      }

      const resp = await fetch(url, { method: "POST", headers, body });
      const ct = resp.headers.get("content-type") || "";
      const text = await resp.text().catch(() => "");

      if (!resp.ok) {
        const msg = ct.includes("application/json") ? (JSON.parse(text).error || text) : `Lecto error ${resp.status} - ${text.slice(0,1000)}`;
        const err = new Error(`Lecto translation error: ${msg}`);
        err.status = resp.status;
        err.body = text;
        throw err;
      }

      if (!ct.includes("application/json")) {
        const err = new Error(`Lecto did not return JSON. content-type='${ct}'. Body starts with: ${text.slice(0,300)}`);
        err.body = text;
        throw err;
      }

      try {
        return JSON.parse(text);
      } catch (e) {
        const err = new Error(`Failed to parse JSON from Lecto: ${e.message}`);
        err.body = text;
        throw err;
      }
    }

    const payload = { q, source, target, format };
    if (apiKey) payload.api_key = apiKey;

    const endpoints = envUrl
      ? [envUrl]
      : [
          "https://libretranslate.com/translate",
          "https://translate.argosopentech.com/translate",
          "https://libretranslate.de/translate",
          "https://libretranslate.org/translate",
        ];

    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // a polite UA to avoid some providers redirecting to an HTML page
      "User-Agent": "SolarBackend/1.0 (+https://example.com)",
    };

    let lastError = null;

    for (const url of endpoints) {
      try {
        
        const resp = await fetch(url, {
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify(payload),
        });
        const contentType = resp.headers.get("content-type") || "";
        const bodyText = await resp.text().catch(() => "");

        

        if (!resp.ok) {
          // try to parse JSON error body for nicer messages
          let parsedErr = null;
          try {
            parsedErr = JSON.parse(bodyText);
          } catch (e) {
            // ignore
          }
          const msg = parsedErr && (parsedErr.error || parsedErr.message)
            ? `Translation service error at ${url}: ${resp.status} ${resp.statusText} - ${parsedErr.error || parsedErr.message}`
            : `Translation service error at ${url}: ${resp.status} ${resp.statusText} - Body: ${bodyText.slice(0, 1000)}`;
          lastError = new Error(msg);
          lastError.status = resp.status;
          lastError.body = bodyText;
          continue;
        }

        // If the endpoint served HTML (website) instead of JSON, skip it quickly
        if (contentType.includes("text/html")) {
          lastError = new Error(
            `Endpoint ${url} returned HTML (content-type=${contentType}). Body starts with: ${bodyText.slice(0, 300)}`
          );
          lastError.body = bodyText;
          continue;
        }

        if (!contentType.includes("application/json")) {
          // Received non-JSON content (not HTML) — try a form-encoded fallback
          try {
            const formBody = new URLSearchParams(payload).toString();
            const formResp = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
                // preserve the same User-Agent to avoid redirects to HTML
                "User-Agent": defaultHeaders["User-Agent"],
              },
              body: formBody,
            });

            const formText = await formResp.text().catch(() => "");
            const formContentType = formResp.headers.get("content-type") || "";

            if (!formResp.ok) {
              const err = new Error(
                `Translation service error at ${url} (form fallback): ${formResp.status} ${formResp.statusText} - Body: ${formText.slice(0, 1000)}`
              );
              err.status = formResp.status;
              err.body = formText;
              throw err;
            }

            if (!formContentType.includes("application/json")) {
              const err = new Error(
                `Fallback also did not return JSON from ${url}. content-type='${formContentType}'. Body starts with: ${formText.slice(0, 1000)}`
              );
              err.body = formText;
              throw err;
            }

            try {
              return JSON.parse(formText);
            } catch (parseErr2) {
              const err = new Error(`Failed to parse JSON from translation service (fallback at ${url}): ${parseErr2.message}`);
              err.body = formText;
              throw err;
            }
          } catch (fallbackErr) {
            // Include both original and fallback bodies for debugging
            const combined = new Error(
              `Original response from ${url} content-type='${contentType}' body='${bodyText.slice(0, 1000)}' | Fallback error: ${fallbackErr.message}`
            );
            combined.originalBody = bodyText;
            combined.fallback = fallbackErr;
            throw combined;
          }
        }

        // safe to parse JSON
        try {
          const data = JSON.parse(bodyText);
          return data;
        } catch (parseErr) {
          lastError = new Error(
            `Failed to parse JSON from translation service at ${url}: ${parseErr.message}`
          );
          lastError.body = bodyText;
          continue;
        }
      } catch (err) {
        // network-level or other errors; remember and try next endpoint
        lastError = err;
        continue;
      }
    }

    // If we exhausted endpoints, throw the last error for debugging
    if (lastError) throw lastError;
    throw new Error("Translation service unavailable");
  },
};

module.exports = translationService;
