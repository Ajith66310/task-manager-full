import { useState, useEffect } from "react";
import adminService from "../services/adminService";
import toast from "react-hot-toast";
import {
  PlusCircle, Pencil, Save, X, User as UserIcon, CalendarDays,
  AlignLeft, Flag, Loader2,
} from "lucide-react";

function AddTask({ addTask, editId, taskToEdit, setEditId }) {
  const initialState = {
    title: "", description: "", dueDate: "", priority: "medium", status: "pending", userId: "",
  };

  const [form, setForm] = useState(initialState);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminService.getUsers();
        setUsers(res.data);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title:       taskToEdit.title || "",
        description: taskToEdit.description || "",
        dueDate:     taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 16) : "",
        priority:    taskToEdit.priority || "medium",
        status:      taskToEdit.status || "pending",
        userId:      taskToEdit.user?._id || taskToEdit.user || "",
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    addTask({
      title: form.title,
      description: form.description,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      priority: form.priority,
      status: form.status,
      userId: form.userId || null,
    });
    setForm(initialState);
    setEditId(null);
  };

  const handleCancel = () => { setForm(initialState); setEditId(null); };

  const priorityOpts = [
    { value: "low",    label: "Low",    color: "#34d399", activeBg: "rgba(16, 185, 129, 0.1)" },
    { value: "medium", label: "Medium", color: "#fbbf24", activeBg: "rgba(245, 158, 11, 0.1)" },
    { value: "high",   label: "High",   color: "#f87171", activeBg: "rgba(239, 68, 68, 0.1)" },
  ];

  const statusOpts = [
    { value: "pending",     label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed",   label: "Completed" },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.iconBox}>
          {editId ? <Pencil size={18} color="#60a5fa" /> : <PlusCircle size={18} color="#60a5fa" />}
        </div>
        <div>
          <h1 className="page-header" style={{ marginBottom: 0 }}>{editId ? "Edit Task" : "Add New Task"}</h1>
          <p className="page-subtitle">{editId ? "Update the task details below" : "Fill in the details to create a new task"}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card" style={styles.formCard}>
        {/* Title */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Task Title <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Update user dashboard..."
            className="input-field"
          />
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <AlignLeft size={14} /> Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add more context about this task..."
            rows={4}
            className="input-field"
            style={{ resize: 'none' }}
          />
        </div>

        {/* Due Date & Priority Row */}
        <div style={styles.gridRow}>
          {/* Due Date */}
          <div style={{ flex: 1 }}>
            <label style={styles.label}>
              <CalendarDays size={14} /> Due Date
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Priority */}
          <div style={{ flex: 1 }}>
            <label style={styles.label}>
              <Flag size={14} /> Priority
            </label>
            <div style={styles.optionsRow}>
              {priorityOpts.map(({ value, label, color, activeBg }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, priority: value }))}
                  style={{
                    ...styles.optionBtn,
                    ...(form.priority === value ? { color: color, borderColor: color, backgroundColor: activeBg } : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Status</label>
          <div style={styles.optionsRow}>
            {statusOpts.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, status: value }))}
                style={{
                  ...styles.optionBtn,
                  ...(form.status === value ? { backgroundColor: '#2563eb', borderColor: '#3b82f6', color: 'white' } : {}),
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Assign to User */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <UserIcon size={14} /> Assign To {loadingUsers && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
          </label>
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Myself (Admin)</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actionsRow}>
        {editId && (
          <button onClick={handleCancel} className="btn-ghost" style={{ padding: '10px 20px' }}>
            <X size={16} /> Cancel
          </button>
        )}
        <button onClick={handleSubmit} className="btn-primary" style={{ padding: '10px 24px' }}>
          {editId ? <><Save size={16} /> Update Task</> : <><PlusCircle size={16} /> Create Task</>}
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "24px",
    maxWidth: "672px",
    margin: "0 auto",
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
    backgroundColor: "rgba(37, 99, 235, 0.2)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#cbd5e1",
    marginBottom: "8px",
  },
  gridRow: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    flexWrap: "wrap",
  },
  optionsRow: {
    display: "flex",
    gap: "8px",
  },
  optionBtn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: "12px",
    border: "1px solid #475569",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  actionsRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
};

export default AddTask;