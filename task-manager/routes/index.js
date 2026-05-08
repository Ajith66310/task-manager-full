const express = require("express");
const taskRoutes = require("./taskRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public auth routes
router.use("/auth", authRoutes);

// Protected task routes — JWT required
router.use("/tasks", protect, taskRoutes);

// Admin routes
router.use("/admin", adminRoutes);

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
