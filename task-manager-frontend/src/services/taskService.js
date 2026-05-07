import API from "./api";

// 🔥 LOCAL STORAGE KEY
const STORAGE_KEY = "tasks";

// 🔥 Helpers
const getLocalTasks = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveLocalTasks = (tasks) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));


// =====================
// 📦 GET TASKS
// =====================
export const getTasks = async (params = {}) => {
  try {
    const res = await API.get("/tasks", { params });
    return res.data.data;
  } catch (err) {
    console.warn("Using localStorage (backend down)");

    let tasks = getLocalTasks();

    // 🔥 simulate filtering
    if (params.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }

    return tasks;
  }
};


// =====================
// ➕ CREATE TASK
// =====================
export const addTask = async (task) => {
  try {
    const res = await API.post("/tasks", task);
    return res.data.data;
  } catch (err) {
    const tasks = getLocalTasks();

    const newTask = {
      ...task,
      _id: Date.now().toString(),
      isOverdue: task.dueDate
        ? new Date(task.dueDate) < new Date()
        : false
    };

    const updated = [...tasks, newTask];
    saveLocalTasks(updated);

    return newTask;
  }
};


// =====================
// ✏️ UPDATE TASK
// =====================
export const updateTask = async (id, updates) => {
  try {
    const res = await API.put(`/tasks/${id}`, updates);
    return res.data.data;
  } catch (err) {
    const tasks = getLocalTasks();

    const updatedTasks = tasks.map((t) =>
      t._id === id ? { ...t, ...updates } : t
    );

    saveLocalTasks(updatedTasks);

    return updatedTasks.find((t) => t._id === id);
  }
};


// =====================
// ❌ DELETE TASK
// =====================
export const deleteTask = async (id) => {
  try {
    await API.delete(`/tasks/${id}`);
  } catch (err) {
    const tasks = getLocalTasks();
    const updated = tasks.filter((t) => t._id !== id);
    saveLocalTasks(updated);
  }
};


// =====================
// 🔄 TOGGLE STATUS
// =====================
export const toggleTaskStatus = async (task) => {
  const nextStatus =
    task.status === "pending"
      ? "in-progress"
      : task.status === "in-progress"
      ? "completed"
      : "pending";

  try {
    const res = await API.put(`/tasks/${task._id}`, {
      ...task,
      status: nextStatus
    });

    return res.data.data;
  } catch (err) {
    const tasks = getLocalTasks();

    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? { ...t, status: nextStatus } : t
    );

    saveLocalTasks(updatedTasks);

    return updatedTasks.find((t) => t._id === task._id);
  }
};