import { useState } from "react";
import { Bell, LogOut, X, CheckCheck } from "lucide-react";

function Navbar({ logout, notifications, setNotifications, currentPage }) {
  const [showNotifs, setShowNotifs] = useState(false);

  const pageLabels = {
    overview: "Overview",
    list: "Task List",
    add: "Add Task",
    users: "User Management",
    verify: "Task Verification",
  };

  return (
    <header style={styles.header}>
      {/* Page title */}
      <div>
        <h1 style={styles.title}>
          {pageLabels[currentPage] || "Dashboard"}
        </h1>
      </div>

      {/* Right actions */}
      <div style={styles.rightSection}>
        {/* Notification bell */}
        <button
          onClick={() => setShowNotifs((s) => !s)}
          className="btn-ghost"
          style={styles.bellBtn}
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span style={styles.notificationBadge}>
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notification dropdown */}
        {showNotifs && (
          <div className="card" style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <p style={styles.dropdownTitle}>Notifications</p>
              {notifications.length > 0 && (
                <button
                  onClick={() => setNotifications([])}
                  style={styles.clearAllBtn}
                >
                  <CheckCheck size={12} /> Clear all
                </button>
              )}
            </div>
            <div style={styles.notifScroll}>
              {notifications.length === 0 ? (
                <div style={styles.emptyNotifs}>
                  No notifications
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} style={styles.notifItem}>
                    <span style={styles.notifText}>{n}</span>
                    <button
                      onClick={() => setNotifications((prev) => prev.filter((_, idx) => idx !== i))}
                      style={styles.removeNotifBtn}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={styles.divider} />

        {/* Logout */}
        <button onClick={logout} className="btn-danger" style={{ fontSize: '14px', padding: '6px 16px' }}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "64px",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  title: {
    color: "white",
    fontWeight: "600",
    fontSize: "18px",
    margin: 0,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
  },
  bellBtn: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "16px",
    height: "16px",
    backgroundColor: "#ef4444",
    color: "white",
    fontSize: "9px",
    fontWeight: "bold",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    top: "48px",
    right: "48px",
    width: "288px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    zIndex: 50,
    overflow: "hidden",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
  },
  dropdownTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    margin: 0,
  },
  clearAllBtn: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#60a5fa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  notifScroll: {
    maxHeight: "256px",
    overflowY: "auto",
  },
  emptyNotifs: {
    padding: "32px 16px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
  notifItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(51, 65, 85, 0.3)",
    transition: "background 0.2s ease",
  },
  notifText: {
    fontSize: "14px",
    color: "#cbd5e1",
  },
  removeNotifBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    marginLeft: "8px",
  },
  divider: {
    width: "1px",
    height: "24px",
    backgroundColor: "#334155",
  },
};

export default Navbar;