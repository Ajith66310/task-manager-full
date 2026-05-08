import { useState, useEffect } from "react";
import adminService from "../services/adminService";
import toast from "react-hot-toast";
import {
  Users as UsersIcon, CheckCircle2, Clock, Search, Shield, Loader2, UserCheck, Mail, Trash2,
} from "lucide-react";


const UserManagement = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (id) => {
    try {
      await adminService.verifyUser(id);
      toast.success("User verified successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to verify user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete all their assigned tasks.")) return;
    try {
      await adminService.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const verified   = users.filter((u) => u.isVerified).length;
  const unverified = users.filter((u) => !u.isVerified).length;

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.iconBox}>
          <UsersIcon size={20} color="#a855f7" />
        </div>
        <div>
          <h1 className="page-header" style={{ marginBottom: 0 }}>User Management</h1>
          <p className="page-subtitle">Manage and verify registered users</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsGrid}>
        <div className="card" style={styles.statCard}>
          <p style={styles.statLabel}>Total Users</p>
          <p style={styles.statValue}>{users.length}</p>
        </div>
        <div className="card" style={{ ...styles.statCard, borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <p style={{ ...styles.statLabel, color: '#34d399' }}>Verified</p>
          <p style={styles.statValue}>{verified}</p>
        </div>
        <div className="card" style={{ ...styles.statCard, borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <p style={{ ...styles.statLabel, color: '#fbbf24' }}>Pending</p>
          <p style={styles.statValue}>{unverified}</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '40px', paddingTop: '10px', paddingBottom: '10px' }}
        />
      </div>

      {/* Table container */}
      {loading ? (
        <div className="card" style={styles.loadingBox}>
          <Loader2 size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={styles.loadingBox}>
          <UsersIcon size={40} color="#334155" style={{ marginBottom: '12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>No users found</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={styles.tableHeader}>
            <div style={{ ...styles.headerCell, flex: 4 }}>
              <UsersIcon size={12} /> Name
            </div>
            <div style={{ ...styles.headerCell, flex: 4 }}>
              <Mail size={12} /> Email
            </div>
            <div style={{ ...styles.headerCell, flex: 2 }}>
              <Shield size={12} /> Status
            </div>
            <div style={{ ...styles.headerCell, flex: 2 }}>
              Action
            </div>
          </div>

          {/* Table Rows */}
          <div style={styles.tableBody}>
            {filtered.map((user) => (
              <div key={user._id} style={styles.tableRow}>
                {/* Name */}
                <div style={{ ...styles.cell, flex: 4 }}>
                  <div style={styles.avatar}>
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span style={styles.userName}>{user.name}</span>
                </div>

                {/* Email */}
                <div style={{ ...styles.cell, flex: 4 }}>
                  <span style={styles.userEmail}>{user.email}</span>
                </div>

                {/* Status */}
                <div style={{ ...styles.cell, flex: 2 }}>
                  <div className={`badge badge-${user.isVerified ? 'completed' : 'pending'}`}>
                    {user.isVerified ? <><CheckCircle2 size={11} style={{ marginRight: '4px' }} /> Verified</> : <><Clock size={11} style={{ marginRight: '4px' }} /> Pending</>}
                  </div>
                </div>

                {/* Action */}
                <div style={{ ...styles.cell, flex: 2 }}>
                  {!user.isVerified ? (
                    <button
                      onClick={() => handleVerify(user._id)}
                      style={styles.verifyBtn}
                    >
                      <UserCheck size={13} /> Verify
                    </button>
                  ) : (
                    <span style={styles.verifiedTag}>Verified ✓</span>
                  )}
                  
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={styles.deleteBtn}
                    title="Delete User"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "24px",
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
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  statCard: {
    padding: "16px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "500",
    margin: 0,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    marginTop: "4px",
    margin: 0,
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
  },
  tableHeader: {
    display: "flex",
    padding: "12px 20px",
    borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
  },
  headerCell: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tableBody: {
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    display: "flex",
    padding: "16px 20px",
    alignItems: "center",
    borderBottom: "1px solid rgba(51, 65, 85, 0.3)",
    transition: "background 0.2s ease",
  },
  cell: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    flexShrink: 0,
    marginRight: "12px",
  },
  userName: {
    fontSize: "14px",
    color: "white",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userEmail: {
    fontSize: "14px",
    color: "#94a3b8",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  verifyBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  verifiedTag: {
    fontSize: "12px",
    color: "#475569",
    fontStyle: "italic",
    marginRight: "12px",
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginLeft: "auto",
  },
};

export default UserManagement;
