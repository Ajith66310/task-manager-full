const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Not authorized. No token provided."));
    }

    // Call user-service to verify token and get user details
    const response = await fetch('http://user-service:5001/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      return next(new ApiError(401, "Invalid token or user does not exist."));
    }

    const data = await response.json();
    req.user = data.data; // data from ApiResponse

    next();
  } catch (err) {
    next(new ApiError(401, "Not authorized, token failed."));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role ${req.user.role} is not authorized to access this route`));
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
