import { useState, useMemo } from "react";
import {
  Trash2, Pencil, CheckCircle2, AlertTriangle, Search, SlidersHorizontal,
  CalendarDays, User as UserIcon, ListFilter,
} from "lucide-react";

const PRIORITY_STYLES = {
  low:    { color: "#34d399", background: "rgba(6, 78, 59, 0.3)", borderColor: "rgba(6, 78, 59, 0.3)" },
  medium: { color: "#fbbf24", background: "rgba(146, 64, 14, 0.3)", borderColor: "rgba(146, 64, 14, 0.3)" },
  high:   { color: "#f87171", background: "rgba(127, 29, 29, 0.3)", borderColor: "rgba(127, 29, 29, 0.3)" },
};

function TaskList({ tasks = [], deleteTask, toggleTask, handleEdit }) {
  const [filter, setFilter]   = useState("all");
  const [sortBy, setSortBy]   = useState("date");
  const [search, setSearch]   = useState("");

  const filtered = useMemo(() => {
    let t = tasks;
    if (filter !== "all") t = t.filter((x) => x.status === filter);
    if (search.trim())    t = t.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()));
    return [...t].sort((a, b) => {
      if (sortBy === "date") return (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "priority") {
        const p = { high: 0, medium: 1, low: 2 };
        return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
      }
      return 0;
    });
  }, [tasks, filter, search, sortBy]);

  const isOverdue = (t) => {
    if (t.isOverdue) return true;
    if (!t.dueDate || t.status === "completed") return false;
    return new Date(t.dueDate) < new Date();
  };

  const filterBtns = [
    { id: "all",         label: "All",         count: tasks.length },
    { id: "pending",     label: "Pending",     count: tasks.filter((t) => t.status === "pending").length },
    { id: "in-progress", label: "In Progress", count: tasks.filter((t) => t.status === "in-progress").length },
    { id: "completed",   label: "Completed",   count: tasks.filter((t) => t.status === "completed").length },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div>
        <h1 className="page-header">Task List</h1>
        <p className="page-subtitle">{tasks.length} total tasks across all users</p>
      </div>

      {/* Toolbar */}
      <div className="card" style={styles.toolbar}>
        <div style={styles.searchSortRow}>
          {/* Search */}
          <div style={styles.searchWrapper}>
            <Search size={16} style={styles.toolbarIcon} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px', paddingBottom: '10px', paddingTop: '10px' }}
            />
          </div>

          {/* Sort */}
          <div style={styles.sortWrapper}>
            <SlidersHorizontal size={15} style={styles.toolbarIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px', paddingBottom: '10px', paddingTop: '10px', paddingRight: '32px' }}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterBtnsWrapper}>
          {filterBtns.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                ...styles.filterBtn,
                ...(filter === id ? styles.filterBtnActive : {}),
              }}
            >
              {label}
              <span style={{
                ...styles.filterCount,
                ...(filter === id ? styles.filterCountActive : {}),
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      {filtered.length === 0 ? (
        <div className="card" style={styles.emptyState}>
          <ListFilter size={40} color="#334155" style={{ marginBottom: '12px' }} />
          <p style={styles.emptyTextPrimary}>No tasks found</p>
          <p style={styles.emptyTextSecondary}>Try adjusting your filters or search</p>
        </div>
      ) : (
        <div style={styles.tasksList}>
          {filtered.map((t) => {
            const overdue = isOverdue(t);
            const priorityStyle = PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.medium;
            return (
              <div
                key={t._id}
                className="card"
                style={{
                  ...styles.taskCard,
                  ...(overdue ? styles.overdueCard : {}),
                }}
              >
                <div style={styles.taskCardInner}>
                  {/* Left accent */}
                  <div style={{
                    ...styles.accentBar,
                    backgroundColor: overdue ? "#ef4444" : t.status === "completed" ? "#10b981" : t.status === "in-progress" ? "#3b82f6" : "#f59e0b"
                  }} />

                  {/* Content */}
                  <div style={styles.taskContent}>
                    <div style={styles.taskHeaderRow}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{
                          ...styles.taskTitle,
                          ...(t.status === "completed" ? styles.completedTitle : {}),
                        }}>
                          {t.title}
                        </h3>
                        {t.description && (
                          <p style={styles.taskDescription}>{t.description}</p>
                        )}
                      </div>
                      <div className={`badge badge-${t.status}`}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </div>
                    </div>

                    <div style={styles.taskMetaRow}>
                      {/* Due date */}
                      <span style={styles.metaItem}>
                        <CalendarDays size={12} />
                        {t.dueDate
                          ? new Date(t.dueDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                          : "No due date"}
                      </span>

                      {/* Priority */}
                      <span style={{
                        ...styles.priorityBadge,
                        color: priorityStyle.color,
                        backgroundColor: priorityStyle.background,
                        borderColor: priorityStyle.borderColor,
                      }}>
                        {t.priority || "medium"}
                      </span>

                      {/* Overdue badge */}
                      {overdue && (
                        <span className="badge-overdue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={10} /> Overdue
                        </span>
                      )}

                      {/* Assigned user */}
                      {t.user && (
                        <span style={styles.metaItem}>
                          <UserIcon size={12} /> {t.user.name || t.user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={styles.actionsBox}>
                    <button
                      onClick={() => t.status !== "completed" && toggleTask(t)}
                      title={t.status === "completed" ? "Task Completed (Locked)" : "Toggle Status"}
                      style={{
                        ...styles.actionIconButton,
                        opacity: t.status === "completed" ? 0.5 : 1,
                        cursor: t.status === "completed" ? "not-allowed" : "pointer",
                      }}
                      className="btn-ghost"
                      disabled={t.status === "completed"}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => t.status !== "completed" && handleEdit(t)}
                      title={t.status === "completed" ? "Task Completed (Locked)" : "Edit"}
                      style={{
                        ...styles.actionIconButton,
                        opacity: t.status === "completed" ? 0.5 : 1,
                        cursor: t.status === "completed" ? "not-allowed" : "pointer",
                      }}
                      className="btn-ghost"
                      disabled={t.status === "completed"}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteTask(t._id)}
                      title="Delete"
                      style={styles.actionIconButton}
                      className="btn-ghost"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  toolbar: {
    padding: "16px",
  },
  searchSortRow: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    position: "relative",
    flex: 1,
    minWidth: "200px",
  },
  sortWrapper: {
    position: "relative",
    minWidth: "160px",
  },
  toolbarIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  },
  filterBtnsWrapper: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  filterBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "rgba(51, 65, 85, 0.6)",
    color: "#94a3b8",
  },
  filterBtnActive: {
    backgroundColor: "#2563eb",
    color: "white",
    boxShadow: "0 10px 15px -3px rgba(30, 58, 138, 0.3)",
  },
  filterCount: {
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: "rgba(71, 85, 105, 0.5)",
    color: "#cbd5e1",
  },
  filterCountActive: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    textAlign: "center",
  },
  emptyTextPrimary: {
    color: "#94a3b8",
    fontWeight: "500",
    margin: 0,
  },
  emptyTextSecondary: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "4px",
    margin: 0,
  },
  tasksList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskCard: {
    padding: "16px",
    transition: "border 0.2s ease",
  },
  overdueCard: {
    borderColor: "rgba(220, 38, 38, 0.4)",
    backgroundColor: "rgba(127, 29, 29, 0.1)",
  },
  taskCardInner: {
    display: "flex",
    alignItems: "stretch",
    gap: "16px",
  },
  accentBar: {
    width: "4px",
    borderRadius: "9999px",
    flexShrink: 0,
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  taskHeaderRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  taskTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  completedTitle: {
    textDecoration: "line-through",
    opacity: 0.6,
  },
  taskDescription: {
    color: "#94a3b8",
    fontSize: "14px",
    marginTop: "2px",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  taskMetaRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  priorityBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid",
  },
  actionsBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0,
  },
  actionIconButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    borderRadius: "8px",
  },
};

export default TaskList;