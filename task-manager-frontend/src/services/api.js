import axios from "axios";

let baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

try {
  const url = new URL(baseURL);
  baseURL = url.origin;
} catch (e) {
  // If it's just a domain or relative path, clean it up manually
  baseURL = baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

const API = axios.create({
  baseURL
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token"); // IMPORTANT: sessionStorage

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔄 Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/"; // Force redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;