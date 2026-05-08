import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Ensure it DOES NOT end with /api
if (baseURL && baseURL.endsWith("/api")) {
  baseURL = baseURL.substring(0, baseURL.length - 4);
}
// Remove trailing slash if present
if (baseURL && baseURL.endsWith("/")) {
  baseURL = baseURL.substring(0, baseURL.length - 1);
}

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
