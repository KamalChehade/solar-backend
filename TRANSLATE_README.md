Translation service

This project calls an external LibreTranslate-compatible API. Public instances change behaviour often; some return an HTML landing page or require an API key.

Configuration

- TRANSLATE_URL: optional. If set, the service will POST to this URL instead of the built-in list. Example: https://libretranslate.com/translate
- TRANSLATE_API_KEY: optional. If set, the key will be included in the payload as `api_key` for providers that require it (e.g. portal.libretranslate.com).

If you see errors like "returned HTML" or responses that start with an HTML document, either set TRANSLATE_URL to a working API endpoint, provide TRANSLATE_API_KEY for providers that require keys, or self-host LibreTranslate.
