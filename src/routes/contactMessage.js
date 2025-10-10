const express = require("express");
const router = express.Router();
const contactMessageController = require("../controller/contactMessage");
const asyncHandler = require("express-async-handler");

// ✅ Create a new contact message
router.post("/create", asyncHandler(contactMessageController.createMessage));

// ✅ Get all contact messages (paginated)
router.get("/", asyncHandler(contactMessageController.getAllMessages));

// ✅ Delete a specific message by ID
router.delete("/:id", asyncHandler(contactMessageController.deleteMessage));

module.exports = router;
