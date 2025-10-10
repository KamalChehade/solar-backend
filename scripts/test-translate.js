require('dotenv').config();

(async ()=>{
  const svc = require('../src/service/translation');
  try {
  const r = await svc.translate({ q: 'translate', source: 'en', target: 'ar', format: 'text' });
   } catch (e) {
    console.error('ERROR MESSAGE:', e.message);
    if (e.status) console.error('STATUS:', e.status);
    if (e.body) {
      console.error('BODY (first 2000 chars):\n', e.body.slice(0, 2000));
    }
    if (e.originalBody) {
      console.error('ORIGINAL BODY (first 2000 chars):\n', e.originalBody.slice(0, 2000));
    }
    if (e.fallback) console.error('FALLBACK ERROR:', e.fallback.message);
    process.exit(1);
  }
})();
