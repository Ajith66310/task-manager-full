const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : "*";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins === "*" || allowedOrigins.includes(origin) || (origin && origin.includes("localhost")) || (origin && origin.includes("vercel.app"))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan('dev'));

// Proxy routes
app.use('/api/auth', createProxyMiddleware({ target: 'http://user-service:5001/api/auth', changeOrigin: true }));
app.use('/api/users', createProxyMiddleware({ target: 'http://user-service:5001/api/users', changeOrigin: true }));
app.use('/api/admin/tasks', createProxyMiddleware({ target: 'http://task-service:5002/api/admin/tasks', changeOrigin: true }));
app.use('/api/admin', createProxyMiddleware({ target: 'http://user-service:5001/api/admin', changeOrigin: true }));
app.use('/api/tasks', createProxyMiddleware({ target: 'http://task-service:5002/api/tasks', changeOrigin: true }));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
