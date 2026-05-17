const express = require("express");
const { body, param, query } = require("express-validator");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const validate = require("../middleware/validate");
const { protect, checkVerified } = require("../middleware/auth");

const router = express.Router();

// All task routes require authentication
router.use(protect);
router.use(checkVerified);

const mongoIdParam = param("id")
  .isMongoId()
  .withMessage("Invalid task ID format");

const taskBodyRules = (isUpdate = false) => {
  const rules = [
    body("title")
      .if(() => !isUpdate)
      .notEmpty()
      .withMessage("Title is required")
      .bail()
      .isString()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),

    body("description")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description cannot exceed 1000 characters"),

    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Status must be one of: pending, in-progress, completed"),

    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be one of: low, medium, high"),

    body("dueDate")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage("dueDate must be a valid ISO 8601 date (e.g. 2025-12-31)")
      .toDate(),
  ];

  return rules;
};

const listQueryRules = [
  query("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("status filter must be: pending | in-progress | completed"),
  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("priority filter must be: low | medium | high"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "dueDate", "priority", "title"])
    .withMessage("sortBy must be one of: createdAt, updatedAt, dueDate, priority, title"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),
];

router.post("/", taskBodyRules(false), validate, createTask);
router.get("/", listQueryRules, validate, getAllTasks);
router.get("/:id", mongoIdParam, validate, getTaskById);
router.put("/:id", mongoIdParam, taskBodyRules(true), validate, updateTask);
router.delete("/:id", mongoIdParam, validate, deleteTask);

module.exports = router;
