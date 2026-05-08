import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Users,
  ShieldCheck,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { id: "overview",  label: "Overview",      Icon: LayoutDashboard },
  { id: "list",      label: "Task List",     Icon: ListTodo },
  { id: "add",       label: "Add Task",      Icon: PlusCircle },
  { id: "users",     label: "Users",         Icon: Users },
  { id: "verify",    label: "Verify Tasks",  Icon: ShieldCheck },
];

function Sidebar({ setPage, currentPage }) {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <Zap size={18} color="white" />
        </div>
        <div>
          <p style={styles.logoText}>TaskFlow</p>
          <p style={styles.logoSubtext}>Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              ...styles.navLink,
              ...(currentPage === id ? styles.navLinkActive : {}),
            }}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {currentPage === id && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>TaskFlow Admin v2.0</p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "256px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    borderRight: "1px solid rgba(51, 65, 85, 0.5)",
    display: "flex",
    flexDirection: "column",
  },
  logoContainer: {
    padding: "24px",
    borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    backgroundColor: "#2563eb",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 15px -3px rgba(30, 58, 138, 0.5)",
  },
  logoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "1",
    margin: 0,
  },
  logoSubtext: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "500",
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    color: "#94a3b8",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left",
    width: "100%",
  },
  navLinkActive: {
    color: "white",
    backgroundColor: "rgba(37, 99, 235, 0.8)",
    boxShadow: "0 10px 15px -3px rgba(30, 58, 138, 0.3)",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(51, 65, 85, 0.5)",
  },
  footerText: {
    fontSize: "12px",
    color: "#64748b",
    textAlign: "center",
    margin: 0,
  },
};

export default Sidebar;