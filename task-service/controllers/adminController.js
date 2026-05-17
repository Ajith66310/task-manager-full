const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/ApiResponse");

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

    // We can't populate user from DB since User is in user-service
    // We should fetch the user from user-service using the token
    const userRes = await fetch(`http://user-service:5001/api/auth/me`, {
         headers: { 'Authorization': req.headers.authorization }
    });
    const userData = await userRes.json();
    
    if (userData.data && userData.data.email) {
      console.log(`Attempting to send assignment email to: ${userData.data.email}`);
      fetch('http://notification-service:5003/api/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.data.email,
          subject: "New Task Assigned",
          message: `Hello ${userData.data.name}, you have been assigned a new task: "${task.title}".`,
          html: `Priority: ${task.priority}\nDescription: ${task.description}`,
        })
      }).catch(err => console.error("Background Email Error (Assignment):", err));
    }

    return sendSuccess(res, 201, "Task assigned successfully", task);
  } catch (err) {
    next(err);
  }
};

const getPendingTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ isVerifiedByAdmin: false });
    // Note: User population omitted for microservices simplicity
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

    const userRes = await fetch(`http://user-service:5001/api/auth/me`, {
         headers: { 'Authorization': req.headers.authorization }
    });
    const userData = await userRes.json();

    if (userData.data && userData.data.email) {
      console.log(`Attempting to send verification email to: ${userData.data.email}`);
      fetch('http://notification-service:5003/api/notifications/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.data.email,
          subject: "Task Completed and Verified",
          message: `Hello ${userData.data.name}, your task "${task.title}" has been completed and verified by the admin.`,
          html: `The task "${task.title}" is now officially closed.`,
        })
      }).catch(err => console.error("Background Email Error (Verification):", err));
    }

    return sendSuccess(res, 200, "Task verified successfully", task);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  assignTask,
  getPendingTasks,
  verifyTask,
};
