import { useState } from "react";
import API from "./services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      if (res.data && res.data.data && res.data.data.token) {
        sessionStorage.setItem("token", res.data.data.token);
        alert("Login successful");
        onLogin();
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password
      });

      if (res.data && res.data.data && res.data.data.token) {
        sessionStorage.setItem("token", res.data.data.token);
        alert("Signup successful");
        onLogin();
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Task Manager</h2>

        {/* 👇 Name only for signup */}
        {showSignup && (
          <input
            type="text"
            placeholder="Name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={showSignup ? handleSignup : handleLogin}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : showSignup
            ? "Signup"
            : "Login"}
        </button>

        {/* 👇 Toggle between login/signup */}
        <p
          style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
          onClick={() => setShowSignup(!showSignup)}
        >
          {showSignup
            ? "Already have an account? Login"
            : "Don't have an account? Signup"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5"
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    width: "250px"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default Login;