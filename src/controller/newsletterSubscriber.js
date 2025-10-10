const newsletterSubscriberService = require("../service/newsletterSubscriber");

const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await newsletterSubscriberService.getAllSubscribers();
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSubscribers,
};
