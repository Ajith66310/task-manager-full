function Sidebar({ setPage }) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Task Manager</h2>

      <button style={styles.button} onClick={() => setPage("add")}>
        ➕ Add Task
      </button>

      <button style={styles.button} onClick={() => setPage("list")}>
        📋 Task List
      </button>

      <button style={styles.button} onClick={() => setPage("overview")}>
        📊 Overview
      </button>
    </div>
  );
}

export default Sidebar;

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1f2937", // dark theme (modern dashboard feel)
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  logo: {
    marginBottom: "20px"
  },
  button: {
    padding: "10px",
    background: "#374151",
    color: "white",
    border: "none",
    borderRadius: "6px",
    textAlign: "left",
    cursor: "pointer"
  }
};