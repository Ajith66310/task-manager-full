require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB, disconnectDB } = require("./config/db");
const User = require("./models/User");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Prefix routes
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return;

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
    console.log(`User Service running on port ${PORT}`);
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
};

startServer();

module.exports = app;
