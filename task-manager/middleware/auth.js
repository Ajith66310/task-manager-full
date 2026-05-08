const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Not authorized. No token provided."));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new ApiError(401, "User belonging to this token no longer exists."));
    }

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token."));
    }
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired. Please log in again."));
    }
    next(err);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role ${req.user.role} is not authorized to access this route`)
      );
    }
    next();
  };
};

const checkVerified = (req, res, next) => {
  if (!req.user.isVerified && req.user.role !== "admin") {
    return next(new ApiError(403, "Your account is not verified. Please wait for admin approval."));
  }
  next();
};

module.exports = { protect, authorize, checkVerified };
