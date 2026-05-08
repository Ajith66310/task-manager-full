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
        .populate("user", "name email") // ✅ Populate user for admin view
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

    await findTaskOrFail(req.params.id, req.user);

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
    ).populate("user", "name email");



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
