// services/authService.js
const { User, Role } = require("../models");
const ExpressError = require("../utils/expressError");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const generateToken = require("../utils/generateToken");

const authService = {
  /**
   * SIGNUP: Register a new user with name, email, password, roleId
   */
  signup: async ({ name, email, password, roleId }) => {
    if (!name || !email || !password || !roleId) {
      throw new ExpressError("All fields (name, email, password, roleId) are required.", 400);
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw new ExpressError("User with this email already exists.", 400);
    }

    // Check if role is valid
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new ExpressError("Invalid role ID.", 400);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      roleId,
    });

    // Generate token
    const token = generateToken({
      id: newUser.id,
      role: role.name,
      email: newUser.email,
    });

    return {
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: role.name,
        createdAt: newUser.createdAt,
      },
    };
  },

  /**
   * LOGIN: Authenticate user with email + password
   */
  login: async ({ email, password }) => {
    if (!email || !password) {
      throw new ExpressError("Email and password are required.", 400);
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [{ model: Role, as: "role", attributes: ["name"] }],
    });

    if (!user) {
      throw new ExpressError("Invalid email or password.", 401);
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      throw new ExpressError("Invalid email or password.", 401);
    }

    const token = generateToken({
      id: user.id,
      role: user.role.name,
      email: user.email,
    });

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  },
};

module.exports = authService;
