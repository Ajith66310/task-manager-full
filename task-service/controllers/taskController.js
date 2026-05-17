const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/ApiResponse");
const findTaskOrFail = async (id, user) => {
  const query = user.role === "admin" ? { _id: id } : { _id: id, user: user.id };
  const task = await Task.findOne(query);
  if (!task) throw new ApiError(404, `Task not found or you don't have permission to access it`);
  return task;
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ 
      title, 
      description, 
      status, 
      priority, 
      dueDate,
      user: req.user.id 
    });



    return sendSuccess(res, 201, "Task created successfully", task);
  } catch (err) {
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ["createdAt", "updatedAt", "dueDate", "priority", "title"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(filter),
    ]);

    const meta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };

    return sendSuccess(res, 200, "Tasks retrieved successfully", tasks, meta);
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await findTaskOrFail(req.params.id, req.user);
    return sendSuccess(res, 200, "Task retrieved successfully", task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await findTaskOrFail(req.params.id, req.user);

    if (task.status === "completed") {
      throw new ApiError(403, "Completed tasks cannot be modified");
    }

    const isVerifiedByAdmin = req.user.role === "admin";

    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };

    const updated = await Task.findOneAndUpdate(
      query,
      { title, description, status, priority, dueDate, isVerifiedByAdmin },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (req.user.role === "admin" && status === "completed" && updated.user) {
      // In a real scenario, we'd fetch the user's email from user-service
      // but for simplicity, we assume we know the email or just send a notification
      // using the User ID. (Assuming updated.user contains the ID).
      console.log(`Admin updated task to completed. Sending email notification request.`);
      
      // Fetch user email from user-service
      const userRes = await fetch(`http://user-service:5001/api/auth/me`, {
         headers: { 'Authorization': req.headers.authorization }
      });
      const userData = await userRes.json();
      
      if (userData.data && userData.data.email) {
          fetch('http://notification-service:5003/api/notifications/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userData.data.email,
              subject: "Task Completed by Admin",
              message: `Hello ${userData.data.name}, your task "${updated.title}" has been marked as completed by the admin.`,
              html: `<h3>Hello ${userData.data.name},</h3><p>Your task <strong>${updated.title}</strong> has been marked as completed by the admin.</p>`,
            })
          }).catch(err => console.error("Background Email Error (Update):", err));
      }
    }

    return sendSuccess(res, 200, "Task updated successfully", updated);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await findTaskOrFail(req.params.id, req.user);
    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };
    await Task.findOneAndDelete(query);



    return sendSuccess(res, 200, "Task deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
