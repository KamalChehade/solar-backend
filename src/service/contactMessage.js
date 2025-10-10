const { ContactMessage } = require("../models");

const createMessage = async (data) => {
  const { name, email, phone, subject, message } = data;

  const newMessage = await ContactMessage.create({
    name,
    email,
    phone: phone || null,
    subject,
    message,
  });

  return newMessage;
};

const getAllMessages = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await ContactMessage.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "subject",
      "message",
      "createdAt",
    ],
  });

  return {
    totalRecords: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    perPage: limit,
    data: rows,
  };
};

const deleteMessage = async (id) => {
  const message = await ContactMessage.findByPk(id);
  if (!message) throw new Error("Message not found");
  await message.destroy();
  return true;
};

module.exports = { getAllMessages, deleteMessage, createMessage };
