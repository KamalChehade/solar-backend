const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");
const User = require("./User");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reading_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "articles",
    timestamps: true,
  }
);

// Associations
Article.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Article, { foreignKey: "categoryId", as: "articles" });

Article.belongsTo(User, { foreignKey: "created_by_id", as: "creator" });

module.exports = Article;
