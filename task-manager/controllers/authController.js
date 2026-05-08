const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/ApiResponse");

// Helper — sign a JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ========================
// POST /api/auth/signup
// ========================
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, "Name, email and password are required"));
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return next(new ApiError(409, "An account with this email already exists"));
    }

    const adminEmail = process.env.ADMIN_EMAIL || "ajith66310@gmail.com";
    const isDefaultAdmin = email.toLowerCase() === adminEmail.toLowerCase();
    
    const role = isDefaultAdmin ? "admin" : "user";
    const isVerified = isDefaultAdmin ? true : false;

    const user = await User.create({ name, email, password, role, isVerified });
    const token = signToken(user._id);

    return sendSuccess(res, 201, "Account created successfully", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ========================
// POST /api/auth/login
// ========================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const token = signToken(user._id);

    return sendSuccess(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ========================
// GET /api/auth/me  (protected)
// ========================
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "User fetched successfully", {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };
