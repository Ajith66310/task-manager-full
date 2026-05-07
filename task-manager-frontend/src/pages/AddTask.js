import { useState, useEffect } from "react";

function AddTask({ addTask, editId, taskToEdit, setEditId }) {
  const initialState = {
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending"
  };

  const [form, setForm] = useState(initialState);

  // ✅ Load data for editing
  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        dueDate: taskToEdit.dueDate
          ? taskToEdit.dueDate.slice(0, 16)
          : "",
        priority: taskToEdit.priority || "medium",
        status: taskToEdit.status || "pending"
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    const formattedData = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate
        ? new Date(form.dueDate).toISOString()
        : null,
      priority: form.priority,
      status: form.status
    };

    addTask(formattedData);

    // ✅ Reset cleanly
    setForm(initialState);
    setEditId(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {editId ? "Edit Task" : "Add New Task"}
      </h2>

      <div style={styles.form}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          style={styles.input}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          style={styles.textarea}
        />

        <label style={styles.label}>Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={handleSubmit} style={styles.primaryButton}>
          {editId ? "Update Task" : "Add Task"}
        </button>

        {editId && (
          <button
            onClick={() => setEditId(null)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default AddTask;

const styles = {
  container: {
    padding: "20px"
  },
  heading: {
    marginBottom: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  textarea: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px"
  },
  label: {
    fontSize: "12px",
    marginBottom: "5px",
    color: "#555"
  },
  primaryButton: {
    padding: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  cancelButton: {
    marginTop: "10px",
    padding: "10px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};