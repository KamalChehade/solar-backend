const contactMessageService = require("../service/contactMessage");

const getAllMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await contactMessageService.getAllMessages(page, limit);
    res.status(200).json({
      success: true,
      message: "Contact messages retrieved successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const id = req.params.id;
    await contactMessageService.deleteMessage(id);
    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllMessages, deleteMessage };
