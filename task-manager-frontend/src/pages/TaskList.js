import { useState, useMemo } from "react";

function TaskList({ tasks = [], deleteTask, toggleTask, handleEdit }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // ✅ Filter tasks safely
  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  // ✅ Sort tasks safely
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === "date") {
        return (a.dueDate ? new Date(a.dueDate) : Infinity) -
               (b.dueDate ? new Date(b.dueDate) : Infinity);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredTasks, sortBy]);

  // ✅ Helpers
  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in-progress") return "In Progress";
    return "Completed";
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "#16a34a";
    if (status === "in-progress") return "#3b82f6";
    return "#f59e0b";
  };

  const formatPriority = (priority) => {
    return priority
      ? priority.charAt(0).toUpperCase() + priority.slice(1)
      : "Medium";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Task List</h2>

      {/* 🔽 Sorting */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={styles.select}
      >
        <option value="date">Sort by Date</option>
        <option value="title">Sort by Title</option>
      </select>

      {/* 🔽 Filters */}
      <div style={styles.filters}>
        <button
          style={filter === "all" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          style={filter === "pending" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>

        <button
          style={filter === "in-progress" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("in-progress")}
        >
          In Progress
        </button>

        <button
          style={filter === "completed" ? styles.activeFilter : styles.filter}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* 🔽 Empty State */}
      {sortedTasks.length === 0 && (
        <p style={styles.empty}>No tasks found</p>
      )}

      {/* 🔽 Task Cards */}
      {sortedTasks.map((t) => {
        const overdue = t.isOverdue;
        const isCompleted = t.status === "completed";

        return (
          <div
            key={t._id}
            style={{
              ...styles.card,
              borderLeft: overdue
                ? "5px solid red"
                : "5px solid #3b82f6",
              backgroundColor: overdue
                ? "#fee2e2"
                : isCompleted
                ? "#dcfce7"
                : "#fff"
            }}
          >
            {/* Content */}
            <div style={styles.content}>
              <h3 style={styles.title}>{t.title}</h3>

              <p style={styles.description}>
                {t.description || "No description"}
              </p>

              <p style={styles.meta}>
                📅{" "}
                {t.dueDate
                  ? new Date(t.dueDate).toLocaleString()
                  : "No due date"}
              </p>

              <p style={styles.meta}>
                ⚡ {formatPriority(t.priority)} Priority
              </p>

              <span
                style={{
                  ...styles.status,
                  background: getStatusColor(t.status)
                }}
              >
                {getStatusLabel(t.status)}
              </span>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                style={styles.actionBtn}
                title="Toggle Status"
                onClick={() => toggleTask(t)}
              >
                ✔
              </button>

              <button
                style={styles.actionBtn}
                title="Edit Task"
                onClick={() => handleEdit(t)}
              >
                ✏️
              </button>

              <button
                style={styles.actionBtn}
                title="Delete Task"
                onClick={() => deleteTask(t._id)}
              >
                ❌
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;

const styles = {
  container: {
    padding: "20px"
  },
  heading: {
    marginBottom: "15px"
  },
  select: {
    marginBottom: "10px",
    padding: "6px",
    borderRadius: "5px"
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  filter: {
    padding: "6px 12px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  activeFilter: {
    padding: "6px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  empty: {
    color: "#777",
    marginTop: "10px"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  content: {
    maxWidth: "70%"
  },
  title: {
    margin: 0
  },
  description: {
    color: "#555",
    margin: "5px 0"
  },
  meta: {
    fontSize: "12px",
    color: "#777"
  },
  status: {
    display: "inline-block",
    marginTop: "5px",
    padding: "3px 8px",
    borderRadius: "5px",
    color: "white",
    fontSize: "12px"
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  actionBtn: {
    border: "none",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "4px"
  }
};