const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  assignTask,
  getPendingTasks,
  verifyTask,
} = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.post("/assign", assignTask);
router.get("/pending", getPendingTasks);
router.patch("/:id/verify", verifyTask);

module.exports = router;
