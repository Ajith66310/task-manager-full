import { useState } from "react";

function Navbar({ logout, notifications, setNotifications }) {
  const [show, setShow] = useState(false);

  return (
    <div style={styles.navbar}>
      <h3>Dashboard</h3>

      <div style={styles.rightSection}>
        {/* 🔔 Notification Bell */}
        <button style={styles.bell} onClick={() => setShow(!show)}>
          🔔 {notifications.length > 0 && `(${notifications.length})`}
        </button>

        {/* 🔽 Dropdown */}
        {show && (
          <div style={styles.dropdown}>
            <h4>Notifications</h4>

            {notifications.length === 0 && <p>No notifications</p>}

            {notifications.map((n, i) => (
              <div key={i} style={styles.notificationItem}>
                <span>{n}</span>

                <button
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                >
                  ❌
                </button>
              </div>
            ))}

            {notifications.length > 0 && (
              <button
                style={styles.clearBtn}
                onClick={() => setNotifications([])}
              >
                Mark all as read
              </button>
            )}
          </div>
        )}

        {/* 🚪 Logout */}
        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderBottom: "1px solid #ddd",
    background: "#fff"
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "relative"
  },
  bell: {
    padding: "6px 10px",
    cursor: "pointer"
  },
  logout: {
    padding: "6px 10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    width: "250px",
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  clearBtn: {
    marginTop: "10px",
    width: "100%"
  }
};