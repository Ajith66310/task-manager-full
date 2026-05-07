import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
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