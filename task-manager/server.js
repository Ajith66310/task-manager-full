require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { connectDB, disconnectDB } = require("./config/db");
const User = require("./models/User");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

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

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../task-manager-frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../task-manager-frontend/build", "index.html"));
  });
}

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const normalizedEmail = adminEmail.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!existingUser) {
    await User.create({
      name: "Admin",
      email: normalizedEmail,
      password: adminPassword,
      role: "admin",
      isVerified: true,
    });
    console.log(`Default admin user created for ${normalizedEmail}`);
    return;
  }

  existingUser.role = "admin";
  existingUser.isVerified = true;
  existingUser.password = adminPassword;
  await existingUser.save();
  console.log(`Default admin credentials synced for ${normalizedEmail}`);
};

const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    console.log(`API base URL: http://localhost:${PORT}/api`);
    console.log(`Allowed Origins: ${allowedOrigins}`);
  });



  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully…`);
    server.close(async () => {
      await disconnectDB();
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    server.close(() => process.exit(1));
  });
};

startServer();

module.exports = app; 
