const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const chatRoutes = require("./routes/chat.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Allow requests from the frontend service
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: "64kb" }));

app.use((req, res, next) => {
  req.id = req.get("x-request-id") || crypto.randomUUID();
  res.set("x-request-id", req.id);
  next();
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/chats", chatRoutes);

app.use((req, res) =>
  res
    .status(404)
    .json({ error: { code: "NOT_FOUND", message: "Route not found" } }),
);

app.use(errorHandler);

module.exports = app;
