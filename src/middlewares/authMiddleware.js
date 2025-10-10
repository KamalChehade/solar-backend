const jwt = require("jsonwebtoken");
const UNAUTHORIZED_PATHS = require("../constants/publicPaths");
const ExpressError = require("../utils/expressError");

const authenticateToken = (req, res, next) => {
  const requestPath = req.path;
  // ✅ Allow if path matches or starts with any public path
  if (UNAUTHORIZED_PATHS.some((path) => requestPath.startsWith(path))) {
    return next();
  }

  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new ExpressError("Invalid Session.", 403);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new ExpressError("Invalid Session.", 403);
    }

    req.user = {
      id: decoded.id,
      role_name: decoded.role_name,
    };

    next();
  });
};

module.exports = authenticateToken;
