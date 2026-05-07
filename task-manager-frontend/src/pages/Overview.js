function Overview({ tasks = [] }) {
  const now = new Date();

  const isSameDay = (d1, d2) =>
    d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);

  const today = tasks.filter(
    (t) =>
      t.dueDate &&
      isSameDay(new Date(t.dueDate), now)
  );

  const upcoming = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) > now &&
      t.status !== "completed"
  );

  const overdue = tasks.filter((t) => t.isOverdue);

  // ✅ Stats (important)
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: overdue.length
  };

  const Section = ({ title, items, color }) => (
    <div style={styles.section}>
      <h3 style={{ ...styles.sectionTitle, color }}>
        {title} ({items.length})
      </h3>

      {items.length === 0 && (
        <p style={styles.empty}>No tasks</p>
      )}

      {items.map((t) => (
        <div key={t._id} style={styles.card}>
          <h4 style={styles.taskTitle}>{t.title}</h4>

          <p style={styles.meta}>
            📅{" "}
            {t.dueDate
              ? new Date(t.dueDate).toLocaleString()
              : "No due date"}
          </p>

          <p style={styles.meta}>
            ⚡ {t.priority}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Overview</h2>

      {/* 🔥 Stats */}
      <div style={styles.stats}>
        <div>Total: {stats.total}</div>
        <div>Completed: {stats.completed}</div>
        <div>Overdue: {stats.overdue}</div>
      </div>

      <div style={styles.grid}>
        <Section title="Today" items={today} color="#3b82f6" />
        <Section title="Upcoming" items={upcoming} color="#16a34a" />
        <Section title="Overdue" items={overdue} color="#dc2626" />
      </div>
    </div>
  );
}

export default Overview;

const styles = {
  container: {
    padding: "20px"
  },
  heading: {
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  section: {
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  sectionTitle: {
    marginBottom: "10px"
  },
  empty: {
    color: "#777"
  },
  card: {
    borderBottom: "1px solid #eee",
    padding: "8px 0"
  },
  taskTitle: {
    margin: 0
  },
  meta: {
    fontSize: "12px",
    color: "#777"
  }
};