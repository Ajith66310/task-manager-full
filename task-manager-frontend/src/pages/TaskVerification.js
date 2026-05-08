import { useState, useEffect } from "react";
import adminService from "../services/adminService";
import toast from "react-hot-toast";
import {
  ShieldCheck, AlertTriangle, User as UserIcon, CalendarDays, Tag, CheckCircle2, Loader2, ClipboardList,
} from "lucide-react";


const TaskVerification = () => {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingTasks = async () => {
    try {
      const response = await adminService.getPendingTasks();
      setTasks(response.data);
    } catch {
      toast.error("Failed to fetch pending tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const handleVerify = async (id) => {
    try {
      await adminService.verifyTask(id);
      toast.success("Task verified!");
      fetchPendingTasks();
    } catch {
      toast.error("Failed to verify task");
    }
  };

  const PRIORITY_COLORS = {
    low:    { color: "#34d399", background: "rgba(6, 78, 59, 0.3)", borderColor: "rgba(6, 78, 59, 0.3)" },
    medium: { color: "#fbbf24", background: "rgba(146, 64, 14, 0.3)", borderColor: "rgba(146, 64, 14, 0.3)" },
    high:   { color: "#f87171", background: "rgba(127, 29, 29, 0.3)", borderColor: "rgba(127, 29, 29, 0.3)" },
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.iconBox}>
          <ShieldCheck size={20} color="#fbbf24" />
        </div>
        <div>
          <h1 className="page-header" style={{ marginBottom: 0 }}>Task Verification</h1>
          <p className="page-subtitle">Review and approve tasks submitted by users</p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card" style={styles.emptyBox}>
          <Loader2 size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading pending tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card" style={styles.emptyBox}>
          <ClipboardList size={42} color="#334155" style={{ marginBottom: '12px' }} />
          <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>All clear!</p>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', margin: 0 }}>No tasks pending verification.</p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {tasks.map((task) => {
            const pStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
            return (
              <div key={task._id} className="card" style={styles.taskCard}>
                <div style={styles.cardContent}>
                  {/* Left */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <div style={styles.titleRow}>
                      <h3 style={styles.taskTitle}>{task.title}</h3>
                      {task.priority && (
                        <span style={{
                          ...styles.priorityBadge,
                          color: pStyle.color,
                          backgroundColor: pStyle.background,
                          borderColor: pStyle.borderColor,
                        }}>
                          <Tag size={10} /> {task.priority}
                        </span>
                      )}
                      <span className="badge badge-pending">
                        <AlertTriangle size={10} style={{ marginRight: '4px' }} /> Awaiting Verification
                      </span>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p style={styles.taskDesc}>{task.description}</p>
                    )}

                    {/* Meta */}
                    <div style={styles.metaRow}>
                      <span style={styles.metaItem}>
                        <UserIcon size={12} />
                        {task.user?.name || "Unknown"} &bull; {task.user?.email || ""}
                      </span>
                      {task.dueDate && (
                        <span style={styles.metaItem}>
                          <CalendarDays size={12} />
                          {new Date(task.dueDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verify button */}
                  <button
                    onClick={() => handleVerify(task._id)}
                    style={styles.verifyBtn}
                  >
                    <CheckCircle2 size={16} /> Verify
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    textAlign: "center",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskCard: {
    padding: "20px",
    transition: "border 0.2s ease",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  taskTitle: {
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    margin: 0,
  },
  priorityBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid",
  },
  taskDesc: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "6px",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
    marginTop: "12px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  verifyBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 10px 15px -3px rgba(6, 78, 59, 0.3)",
    flexShrink: 0,
  },
};

export default TaskVerification;
