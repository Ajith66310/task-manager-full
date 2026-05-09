import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/MyNavbar";
import AddTask from "./pages/AddTask";
import TaskList from "./pages/TaskList";
import Overview from "./pages/Overview";
import Login from "./Login";
import UserManagement from "./pages/UserManagement";
import TaskVerification from "./pages/TaskVerification";
import { Toaster } from "react-hot-toast";

import {
  getTasks,
  addTask as createTask,
  updateTask,
  deleteTask as removeTask,
  toggleTaskStatus,
} from "./services/taskService";
import adminService from "./services/adminService";
import toast from "react-hot-toast";



function App() {
  const [page, setPage] = useState("overview");

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!sessionStorage.getItem("token")
  );

  const [tasks, setTasks]             = useState([]);
  const [editId, setEditId]           = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters]         = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

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
    if (isLoggedIn) {
      loadTasks();
    }
  }, [filters, loadTasks, isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage("overview");
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
    setPage("overview");
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      if (editId) {
        await updateTask(editId, taskData);
        toast.success("Task updated");
      } else {
        if (taskData.userId) {
          await adminService.assignTask(taskData);
          toast.success("Task assigned successfully");
        } else {
          await createTask(taskData);
          toast.success("Task created");
        }


      }
      await loadTasks();
      setEditId(null);
      setPage("list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await removeTask(id);
      await loadTasks();
      toast.success("Task deleted");
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const toggleTask = async (task) => {
    try {
      await toggleTaskStatus(task);
      await loadTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setPage("add");
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" } }} />
      </>
    );
  }

  return (
    <div style={styles.appWrapper}>
      <Sidebar setPage={setPage} currentPage={page} />

      <div style={styles.mainContent}>
        <Navbar
          logout={logout}
          notifications={notifications}
          setNotifications={setNotifications}
          currentPage={page}
        />

        <main style={styles.scrollArea}>
          {error && (
            <div className="card" style={styles.errorBanner}>
              <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p>
              <button onClick={() => { setError(null); loadTasks(); }} style={styles.retryBtn}>
                Retry
              </button>
            </div>
          )}

          {loading && tasks.length === 0 ? (
            <div style={styles.loadingArea}>
              <div style={styles.loadingContent}>
                <div style={styles.spinner} />
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Loading tasks...</p>
              </div>
            </div>
          ) : (
            <div style={styles.pageWrapper}>
              {page === "overview" && <Overview tasks={tasks} />}
              {page === "list"     && (
                <TaskList
                  tasks={tasks}
                  deleteTask={deleteTask}
                  toggleTask={toggleTask}
                  handleEdit={handleEdit}
                  setFilters={setFilters}
                />
              )}
              {page === "add"     && (
                <AddTask
                  addTask={addTask}
                  editId={editId}
                  taskToEdit={tasks.find((t) => t._id === editId)}
                  setEditId={setEditId}
                  isSaving={loading}
                />
              )}
              {page === "users"   && <UserManagement />}
              {page === "verify"  && <TaskVerification />}
            </div>
          )}
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid #334155",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}

const styles = {
  appWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
  },
  pageWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  errorBanner: {
    margin: "24px",
    padding: "16px",
    backgroundColor: "rgba(127, 29, 29, 0.1)",
    borderColor: "rgba(220, 38, 38, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  retryBtn: {
    background: "none",
    border: "none",
    color: "#60a5fa",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "500",
  },
  loadingArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "256px",
  },
  loadingContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "4px solid rgba(59, 130, 246, 0.2)",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default App;