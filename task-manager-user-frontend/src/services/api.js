import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

try {
  const url = new URL(baseURL);
  baseURL = url.origin;
} catch (e) {
  baseURL = baseURL.replace(/\/api\/?$/, "").replace(/\/$/, "");
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
      // Do not redirect if the failure is on the login route
      if (error.config && !error.config.url.includes("/login")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
