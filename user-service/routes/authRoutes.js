const express = require("express");
const { body } = require("express-validator");
const { signup, login, getMe, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const signupRules = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isString().trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// Public routes
router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.post("/reset-password", resetPassword);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;
