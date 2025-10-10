require('dotenv').config();
const articleService = require('../src/service/article');

(async ()=>{
  try{
    // create article with cover_image path
    const translations = [{ lang: 'en', title: 't', excerpt: 'e', content: 'c' }];
    const article = await articleService.create({ translations, cover_image: 'src/uploads/test1.png', categoryId: 1 });
 
    // update article without file (cover_image undefined) - should keep previous
    const updated = await articleService.update(article.id, { translations: [{ lang: 'en', title: 't2', excerpt: 'e2', content: 'c2' }] });
   }catch(e){
    console.error(e);
  }
})();
