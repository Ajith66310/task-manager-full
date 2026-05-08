const User = require("../models/User");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/ApiResponse");


const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    return sendSuccess(res, 200, "Users retrieved successfully", users);
  } catch (err) {
    next(err);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!user) throw new ApiError(404, "User not found");



    return sendSuccess(res, 200, "User verified successfully", user);
  } catch (err) {
    next(err);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, userId } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: userId,
      isVerifiedByAdmin: true,
    });

    const populatedTask = await Task.findById(task._id).populate("user", "name email");


    return sendSuccess(res, 201, "Task assigned successfully", task);
  } catch (err) {
    next(err);
  }
};

const getPendingTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ isVerifiedByAdmin: false }).populate("user", "name email");
    return sendSuccess(res, 200, "Pending tasks retrieved successfully", tasks);
  } catch (err) {
    next(err);
  }
};

const verifyTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isVerifiedByAdmin: true },
      { new: true }
    );
    if (!task) throw new ApiError(404, "Task not found");

    const populatedTask = await Task.findById(task._id).populate("user", "name email");


    return sendSuccess(res, 200, "Task verified successfully", task);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  verifyUser,
  assignTask,
  getPendingTasks,
  verifyTask,
};
