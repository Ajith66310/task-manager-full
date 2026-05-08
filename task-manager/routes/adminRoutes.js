const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getAllUsers,
  verifyUser,
  assignTask,
  getPendingTasks,
  verifyTask,
} = require("../controllers/adminController");

// All routes here require admin privileges
router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/verify", verifyUser);
router.post("/tasks/assign", assignTask);
router.get("/tasks/pending", getPendingTasks);
router.patch("/tasks/:id/verify", verifyTask);

module.exports = router;
