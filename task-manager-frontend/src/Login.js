import { useState } from "react";
import API from "./services/api";
import toast from "react-hot-toast";
import { Zap, Mail, Lock, LogIn } from "lucide-react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data?.data?.token) {
        const { token, user } = res.data.data;
        if (user.role !== "admin") {
          toast.error("Access denied. Admin only.");
          return;
        }
        sessionStorage.setItem("token", token);
        toast.success("Welcome back, Admin!");
        onLogin();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.container}>
      {/* Background decorations */}
      <div style={styles.bgDecorTop} />
      <div style={styles.bgDecorBottom} />

      <div style={styles.contentWrapper}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <Zap size={30} color="white" />
          </div>
          <h1 style={styles.logoTitle}>TaskFlow</h1>
          <p style={styles.logoSubtext}>Admin Control Center</p>
        </div>

        {/* Card */}
        <div className="card" style={styles.loginCard}>
         

          <h2 style={styles.cardTitle}>Sign In</h2>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="admin@example.com"
                className="input-field"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary"
            style={styles.submitBtn}
          >
            {loading ? (
              <span style={styles.loadingWrapper}>
                <div style={styles.spinner} />
                Authenticating...
              </span>
            ) : (
              <>
                <LogIn size={18} /> Sign In to Admin
              </>
            )}
          </button>
        </div>

        <p style={styles.footerText}>
          © 2026 TaskFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    position: "relative",
    overflow: "hidden",
  },
  bgDecorTop: {
    position: "absolute",
    top: "-160px",
    right: "-160px",
    width: "384px",
    height: "384px",
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    borderRadius: "50%",
    filter: "blur(64px)",
    pointerEvents: "none",
  },
  bgDecorBottom: {
    position: "absolute",
    bottom: "-160px",
    left: "-160px",
    width: "384px",
    height: "384px",
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    borderRadius: "50%",
    filter: "blur(64px)",
    pointerEvents: "none",
  },
  contentWrapper: {
    width: "100%",
    maxW: "448px",
    position: "relative",
    maxWidth: "400px",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    backgroundColor: "#2563eb",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.5)",
    marginBottom: "16px",
  },
  logoTitle: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "white",
    margin: 0,
  },
  logoSubtext: {
    color: "#94a3b8",
    marginTop: "4px",
    fontSize: "14px",
    margin: 0,
  },
  loginCard: {
    padding: "32px",
  },
  notice: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(146, 64, 14, 0.2)",
    border: "1px solid rgba(180, 83, 9, 0.3)",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "24px",
  },
  noticeIcon: {
    color: "#fbbf24",
    flexShrink: 0,
  },
  noticeText: {
    color: "#fcd34d",
    fontSize: "12px",
    fontWeight: "500",
    margin: 0,
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "24px",
    margin: 0,
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#94a3b8",
    marginBottom: "8px",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  },
  submitBtn: {
    width: "100%",
    justifyContent: "center",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "8px",
  },
  loadingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  footerText: {
    textAlign: "center",
    color: "#475569",
    fontSize: "12px",
    marginTop: "24px",
    margin: 0,
  },
};

export default Login;