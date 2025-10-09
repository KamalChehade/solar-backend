
```
solar-backend
├─ TRANSLATE_README.md
├─ package-lock.json
├─ package.json
├─ scripts
│  ├─ check-endpoints.js
│  ├─ test-category.js
│  └─ test-translate.js
├─ server.js
└─ src
   ├─ app.js
   ├─ config
   │  ├─ corsConfig.js
   │  └─ database.js
   ├─ constants
   │  └─ publicPaths.js
   ├─ controller
   │  ├─ article.js
   │  ├─ auth.js
   │  ├─ category.js
   │  └─ translation.js
   ├─ middlewares
   │  ├─ articleUpload.js
   │  ├─ authMiddleware.js
   │  └─ errorHandler.js
   ├─ models
   │  ├─ Article.js
   │  ├─ ArticleTranslation.js
   │  ├─ Category.js
   │  ├─ CategoryTranslation.js
   │  ├─ Role.js
   │  ├─ User.js
   │  └─ index.js
   ├─ routes
   │  ├─ article.js
   │  ├─ auth.js
   │  ├─ category.js
   │  ├─ index.js
   │  └─ translations.js
   ├─ service
   │  ├─ article.js
   │  ├─ auth.js
   │  ├─ category.js
   │  ├─ googleTranslate.js
   │  ├─ plucky-courier-451717-b7-8350751af0e4.json
   │  └─ translation.js
   └─ utils
      ├─ expressError.js
      ├─ generateToken.js
      └─ passwordUtils.js

```