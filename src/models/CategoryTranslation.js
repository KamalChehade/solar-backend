const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");

const CategoryTranslation = sequelize.define(
  "CategoryTranslation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    lang: {
      type: DataTypes.ENUM("en", "ar"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "category_translations",
    timestamps: true,
  }
);

Category.hasMany(CategoryTranslation, {
  foreignKey: "categoryId",
  as: "translations",
  onDelete: "CASCADE",
});

CategoryTranslation.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports = CategoryTranslation;
