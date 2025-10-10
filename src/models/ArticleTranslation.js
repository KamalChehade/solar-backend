const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Article = require("./Article");

const ArticleTranslation = sequelize.define(
  "ArticleTranslation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Article,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    lang: {
      type: DataTypes.ENUM("en", "ar"),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true, // author name per translation
    },
  },
  {
    tableName: "article_translations",
    timestamps: true,
  }
);

Article.hasMany(ArticleTranslation, {
  foreignKey: "articleId",
  as: "translations",
  onDelete: "CASCADE",
});

ArticleTranslation.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
});

module.exports = ArticleTranslation;
