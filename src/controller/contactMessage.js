const contactMessageService = require("../service/contactMessage");

const createMessage = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, subject, and message are required.",
    });
  }

  const newMessage = await contactMessageService.createMessage({
    name,
    email,
    phone,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Message created successfully.",
    data: newMessage,
  });
};

const getAllMessages = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await contactMessageService.getAllMessages(page, limit);
  res.status(200).json({
    success: true,
    message: "Contact messages retrieved successfully",
    ...result,
  });
};

const deleteMessage = async (req, res, next) => {
  const id = req.params.id;
  await contactMessageService.deleteMessage(id);
  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
};

module.exports = { createMessage, getAllMessages, deleteMessage };
