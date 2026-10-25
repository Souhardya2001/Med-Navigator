const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get("origin");
  if (!origin) return next();
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: "Origin is not allowed" });
  }

  res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});

app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(cookieParser());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorMiddleware);

// Keep service ports independent when all services share the repository .env file.
const port = Number(process.env.AUTH_PORT || 4000);

async function start() {
  await connectDB();
  app.listen(port, () => console.log(`Auth service is running on port ${port}`));
}

start().catch((error) => {
  console.error("Auth service failed to start", error);
  process.exit(1);
});

module.exports = app;
