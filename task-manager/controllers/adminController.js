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

    console.log(`Task assigned to user: ${populatedTask.user?.email || "No email found"}`);

    // Send email notification (Background)
    if (populatedTask.user && populatedTask.user.email) {
      console.log(`Attempting to send assignment email to: ${populatedTask.user.email}`);
      sendEmail({
        email: populatedTask.user.email,
        subject: "New Task Assigned",
        message: `Hello ${populatedTask.user.name}, you have been assigned a new task: "${populatedTask.title}".`,
        html: `Priority: ${populatedTask.priority}\nDescription: ${populatedTask.description}`,
      }).catch(err => console.error("Background Email Error (Assignment):", err.message));

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

    console.log(`Task verified for user: ${populatedTask.user?.email || "No email found"}`);

    // Send email notification (Background)
    if (populatedTask.user && populatedTask.user.email) {
      console.log(`Attempting to send verification email to: ${populatedTask.user.email}`);
      sendEmail({
        email: populatedTask.user.email,
        subject: "Task Completed and Verified",
        message: `Hello ${populatedTask.user.name}, your task "${populatedTask.title}" has been completed and verified by the admin.`,
        html: `The task "${populatedTask.title}" is now officially closed.`,
      }).catch(err => console.error("Background Email Error (Verification):", err.message));

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
