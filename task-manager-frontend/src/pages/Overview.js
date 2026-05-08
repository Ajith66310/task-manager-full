import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  CheckCircle, Clock, AlertTriangle, ListTodo, TrendingUp, CalendarDays, User as UserIcon,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

function Overview({ tasks = [] }) {
  const now = new Date();

  const isSameDay = (d1, d2) => {
    try { return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10); }
    catch { return false; }
  };

  const today = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return !isNaN(d.getTime()) && isSameDay(d, now);
  });

  const upcoming = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return !isNaN(d.getTime()) && d > now && t.status !== "completed" && !isSameDay(d, now);
  });

  const overdue = tasks.filter((t) => {
    if (t.isOverdue) return true;
    if (!t.dueDate || t.status === "completed") return false;
    return new Date(t.dueDate) < now && !isSameDay(new Date(t.dueDate), now);
  });

  const total      = tasks.length;
  const completed  = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pending    = tasks.filter((t) => t.status === "pending").length;

  const pieData = [
    { name: "Pending",     value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Completed",   value: completed },
    { name: "Overdue",     value: overdue.length },
  ].filter((d) => d.value > 0);

  const priorityData = [
    { name: "Low",    value: tasks.filter((t) => t.priority === "low").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length },
    { name: "High",   value: tasks.filter((t) => t.priority === "high").length },
  ];

  const statCards = [
    { label: "Total Tasks",   value: total,            Icon: ListTodo,      color: "#60a5fa", bg: "rgba(30, 58, 138, 0.3)", borderColor: "rgba(30, 58, 138, 0.3)" },
    { label: "Completed",     value: completed,        Icon: CheckCircle,   color: "#34d399", bg: "rgba(6, 78, 59, 0.3)",  borderColor: "rgba(6, 78, 59, 0.3)" },
    { label: "In Progress",   value: inProgress,       Icon: TrendingUp,    color: "#60a5fa", bg: "rgba(30, 58, 138, 0.3)", borderColor: "rgba(30, 58, 138, 0.3)" },
    { label: "Overdue",       value: overdue.length,   Icon: AlertTriangle, color: "#f87171", bg: "rgba(127, 29, 29, 0.3)", borderColor: "rgba(127, 29, 29, 0.3)" },
  ];

  const TaskSection = ({ title, items, color, Icon }) => (
    <div className="card" style={styles.taskSection}>
      <div style={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={16} color={color} />
          <h3 style={{ ...styles.sectionTitle, color }}>{title}</h3>
        </div>
        <span style={styles.sectionCount}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p style={styles.emptyText}>No tasks</p>
      ) : (
        <div style={styles.scrollArea}>
          {items.map((t) => (
            <div key={t._id} style={styles.miniCard}>
              <p style={styles.miniTitle}>{t.title}</p>
              <div style={styles.miniMeta}>
                <span style={styles.metaIconText}>
                  <CalendarDays size={11} />
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"}
                </span>
                {t.user && (
                  <span style={styles.metaIconText}>
                    <UserIcon size={11} /> {t.user.name || t.user.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div>
        <h1 className="page-header">Overview</h1>
        <p className="page-subtitle">Monitor all tasks across users from one place</p>
      </div>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        {statCards.map(({ label, value, Icon, color, bg, borderColor }) => (
          <div key={label} className="card" style={{ ...styles.statCard, borderColor }}>
            <div style={styles.statContent}>
              <div>
                <p style={styles.statLabel}>{label}</p>
                <p style={styles.statValue}>{value}</p>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: bg }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            {total > 0 && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBarBg}>
                  <div
                    style={{
                      ...styles.progressBarFill,
                      backgroundColor: color,
                      width: `${Math.round((value / total) * 100)}%`,
                    }}
                  />
                </div>
                <p style={styles.progressText}>{Math.round((value / total) * 100)}% of total</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={styles.chartsGrid}>
        {/* Status Pie Chart */}
        <div className="card" style={styles.chartCard}>
          <h2 style={styles.chartCardTitle}>
            <CheckCircle size={16} color="#60a5fa" /> Task Status Distribution
          </h2>
          {pieData.length === 0 ? (
            <div style={styles.chartEmpty}>No data yet</div>
          ) : (
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0" }}
                  />
                  <Legend
                    formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Priority Bar Chart */}
        <div className="card" style={styles.chartCard}>
          <h2 style={styles.chartCardTitle}>
            <TrendingUp size={16} color="#34d399" /> Tasks by Priority
          </h2>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, color: "#e2e8f0" }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={["#10b981", "#f59e0b", "#ef4444"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div style={styles.sectionsGrid}>
        <TaskSection title="Due Today"  items={today}    color="#60a5fa" Icon={CalendarDays} />
        <TaskSection title="Upcoming"   items={upcoming} color="#34d399" Icon={Clock} />
        <TaskSection title="Overdue"    items={overdue}  color="#f87171" Icon={AlertTriangle} />
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    padding: "20px",
  },
  statContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: 0,
  },
  statValue: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "white",
    marginTop: "8px",
    margin: 0,
  },
  statIconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    marginTop: "12px",
  },
  progressBarBg: {
    height: "6px",
    backgroundColor: "#1e293b",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.7s ease",
  },
  progressText: {
    color: "#64748b",
    fontSize: "12px",
    marginTop: "4px",
    margin: 0,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  chartCard: {
    padding: "24px",
  },
  chartCardTitle: {
    color: "white",
    fontWeight: "600",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
    fontSize: "16px",
  },
  chartEmpty: {
    height: "192px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },
  sectionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  taskSection: {
    padding: "20px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: "14px",
    margin: 0,
  },
  sectionCount: {
    fontSize: "12px",
    backgroundColor: "#334155",
    color: "#cbd5e1",
    padding: "2px 8px",
    borderRadius: "9999px",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    textAlign: "center",
    padding: "16px 0",
    margin: 0,
  },
  scrollArea: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "256px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  miniCard: {
    backgroundColor: "rgba(51, 65, 85, 0.4)",
    borderRadius: "12px",
    padding: "12px",
    border: "1px solid rgba(71, 85, 105, 0.3)",
  },
  miniTitle: {
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  miniMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "6px",
  },
  metaIconText: {
    color: "#94a3b8",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
};

export default Overview;