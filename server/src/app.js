const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Task Manager API running 🚀" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/timelogs", require("./routes/timeLogRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

module.exports = app;