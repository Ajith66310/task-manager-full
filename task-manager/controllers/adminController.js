const User = require("../models/User");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/ApiResponse");
const sendEmail = require("../utils/email");


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

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    // Also delete all tasks associated with this user
    await Task.deleteMany({ user: req.params.id });

    return sendSuccess(res, 200, "User and associated tasks deleted successfully");
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

    // Send email notification
    if (populatedTask.user && populatedTask.user.email) {
      await sendEmail({
        email: populatedTask.user.email,
        subject: "New Task Assigned",
        message: `Hello ${populatedTask.user.name}, you have been assigned a new task: "${populatedTask.title}". Priority: ${populatedTask.priority}.`,
        html: `<h3>Hello ${populatedTask.user.name},</h3><p>You have been assigned a new task: <strong>${populatedTask.title}</strong>.</p><p>Priority: ${populatedTask.priority}</p><p>Description: ${populatedTask.description}</p>`,
      });
    }

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

    // Send email notification
    if (populatedTask.user && populatedTask.user.email) {
      await sendEmail({
        email: populatedTask.user.email,
        subject: "Task Completed and Verified",
        message: `Hello ${populatedTask.user.name}, your task "${populatedTask.title}" has been completed and verified by the admin.`,
        html: `<h3>Hello ${populatedTask.user.name},</h3><p>Your task <strong>${populatedTask.title}</strong> has been completed and verified by the admin.</p>`,
      });
    }

    return sendSuccess(res, 200, "Task verified successfully", task);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  verifyUser,
  deleteUser,
  assignTask,
  getPendingTasks,
  verifyTask,
};
