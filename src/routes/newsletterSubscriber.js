const express = require("express");
const router = express.Router();
const newsletterSubscriberController = require("../controller/newsletterSubscriber");
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(newsletterSubscriberController.getAllSubscribers));

module.exports = router;
