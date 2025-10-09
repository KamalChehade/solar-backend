const express = require("express");
const router = express.Router();
const contactMessageController = require("../controller/contactMessage");
const asyncHandler = require("express-async-handler");

// GET /solar-api/contact-messages?page=1&limit=10
router.get("/", asyncHandler(contactMessageController.getAllMessages));

// DELETE /solar-api/contact-messages/:id
router.delete("/:id", asyncHandler(contactMessageController.deleteMessage));

module.exports = router;
