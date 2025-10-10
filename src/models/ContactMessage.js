const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20), // ✅ Supports +961 and international numbers
      allowNull: true, // Optional but you can make it false if required
      validate: {
        is: /^[0-9+\-\s()]*$/i, // ✅ Allows digits, +, -, spaces, and parentheses
      },
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true, // ✅ Sequelize auto-adds createdAt & updatedAt
    tableName: "contact_messages",
  }
);

module.exports = ContactMessage;
