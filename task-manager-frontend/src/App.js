import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/MyNavbar";
import AddTask from "./pages/AddTask";
import TaskList from "./pages/TaskList";
import Overview from "./pages/Overview";
import Login from "./Login";

import {
  getTasks,
  addTask as createTask,
  updateTask,
  deleteTask as removeTask,
  toggleTaskStatus
} from "./services/taskService";

function App() {
  const [page, setPage] = useState("list");

  // Check for existing token on mount
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!sessionStorage.getItem("token")
  );

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // 📦 LOAD TASKS
  // =========================
  const loadTasks = useCallback(async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTasks(customFilters);
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks. Backend may be down.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isLoggedIn) loadTasks();
  }, [filters, loadTasks, isLoggedIn]);

  // =========================
  // 🔐 Auth
  // =========================
  const handleLogin = () => {
    // token is already stored in sessionStorage by Login.js
    setIsLoggedIn(true);
    setPage("list");
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
    setPage("list");
  };


  // =========================
  // ➕ ADD / ✏️ EDIT
  // =========================
  const addTask = async (taskData) => {
    try {
      setLoading(true);

      if (editId) {
        await updateTask(editId, taskData);
      } else {
        await createTask(taskData);
      }

      await loadTasks();
      setEditId(null);
      setPage("list");
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ❌ DELETE
  // =========================
  const deleteTask = async (id) => {
    try {
      await removeTask(id);
      await loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    }
  };

  // =========================
  // ✔ TOGGLE
  // =========================
  const toggleTask = async (task) => {
    try {
      await toggleTaskStatus(task);
      await loadTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
      setError("Failed to update task");
    }
  };

  // =========================
  // ✏️ EDIT
  // =========================
  const handleEdit = (task) => {
    setEditId(task._id);
    setPage("add");
  };

  // =========================
  // 🔐 LOGIN SCREEN
  // =========================
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // =========================
  // 🚨 ERROR UI
  // =========================
  if (error) {
    return (
      <div style={styles.center}>
        <h2>{error}</h2>
        <button onClick={() => loadTasks()}>Retry</button>
      </div>
    );
  }

  // =========================
  // ⏳ LOADING UI
  // =========================
  if (loading && tasks.length === 0) {
    return (
      <div style={styles.center}>
        <h2>Loading tasks...</h2>
      </div>
    );
  }

  // =========================
  // ✅ MAIN UI
  // =========================
  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <div style={{ flex: 1 }}>
        <Navbar
          logout={logout}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {page === "add" && (
          <AddTask
            addTask={addTask}
            editId={editId}
            taskToEdit={tasks.find((t) => t._id === editId)}
            setEditId={setEditId}
          />
        )}

        {page === "list" && (
          <TaskList
            tasks={tasks}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
            handleEdit={handleEdit}
            setFilters={setFilters}
          />
        )}

        {page === "overview" && <Overview tasks={tasks} />}
      </div>
    </div>
  );
}

export default App;

const styles = {
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "10px"
  }
};