const User = require("../models/User");
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

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    // We'd ideally send a message to task-service to delete tasks here, 
    // but for now we just delete the user.
    return sendSuccess(res, 200, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, verifyUser, deleteUser };
