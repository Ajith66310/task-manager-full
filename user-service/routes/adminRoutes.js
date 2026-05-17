const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getAllUsers, verifyUser, deleteUser } = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/verify", verifyUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
