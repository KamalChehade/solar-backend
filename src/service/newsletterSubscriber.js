const { NewsletterSubscriber } = require("../models");

const getAllSubscribers = async () => {
  return await NewsletterSubscriber.findAll();
};

module.exports = {
  getAllSubscribers,
};
