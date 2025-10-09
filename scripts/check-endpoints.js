const endpoints = [
  "https://libretranslate.de/translate",
  "https://libretranslate.com/translate",
  "https://translate.argosopentech.com/translate",
  "https://libretranslate.org/translate",
];

const payload = { q: 'translate', source: 'en', target: 'ar', format: 'text' };

(require('dotenv').config());

(async () => {
  for (const url of endpoints) {
     try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'SolarBackend/1.0' },
        body: JSON.stringify(payload),
      });
      
     } catch (e) {
      console.error('JSON POST ERROR', e.message);
    }

    try {
      const formBody = new URLSearchParams(payload).toString();
      const resp2 = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', 'User-Agent': 'SolarBackend/1.0' },
        body: formBody,
      });
  const ct2 = resp2.headers.get('content-type') || '';
  const txt2 = await resp2.text().catch(() => '');
  // no console.log output as requested
    } catch (e) {
      console.error('FORM POST ERROR', e.message);
    }
  }
})();
