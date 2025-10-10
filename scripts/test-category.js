require('dotenv').config();
const svc = require('../src/service/category');

(async ()=>{
  try{
    const translations = [
      { lang: 'en', title: 'Test category' },
      { lang: 'ar', title: 'اختبار' }
    ];
  const r = await svc.create({ translations });
   }catch(e){
    console.error('TEST ERROR', e);
  }
})();
