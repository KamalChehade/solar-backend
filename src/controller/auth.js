// controllers/authController.js
const authService = require("../service/auth");

/**
 * Controller for authentication (signup / login)
 */
const authController = {
  
  signup: async (req, res, next) => {
    try {
      const { name, email, password, roleId } = req.body;

      const result = await authService.signup({ name, email, password, roleId });

      return res.status(201).json({
        success: true,
        message: result.message,
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      next(err); // handled by global error middleware
    }
  },

  /**
   * @desc Login user with email + password
   * @route POST /api/auth/login
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: result.message,
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
