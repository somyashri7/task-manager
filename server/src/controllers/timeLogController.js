const TimeLog = require("../models/TimeLog");
const Task = require("../models/Task");

const today = () => new Date().toISOString().split("T")[0];

const startTimer = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.userId });
    if (!task) return res.status(403).json({ error: "Task not found" });
    const running = await TimeLog.findOne({ user: req.userId, task: req.params.taskId, endTime: null });
    if (running) return res.status(400).json({ error: "Timer already running" });
    const log = await TimeLog.create({ user: req.userId, task: req.params.taskId, startTime: new Date(), date: today() });
    if (task.status === "Pending") { task.status = "In Progress"; await task.save(); }
    res.status(201).json(log);
  } catch (err) {
    console.error("START TIMER ERROR:", err.message);
    res.status(500).json({ error: "Failed to start timer" });
  }
};

const stopTimer = async (req, res) => {
  try {
    const log = await TimeLog.findOne({ _id: req.params.logId, user: req.userId });
    if (!log) return res.status(404).json({ error: "Log not found" });
    if (log.endTime) return res.status(400).json({ error: "Timer already stopped" });
    const endTime = new Date();
    log.endTime = endTime;
    log.duration = Math.floor((endTime - new Date(log.startTime)) / 1000);
    await log.save();
    res.status(200).json(log);
  } catch (err) {
    console.error("STOP TIMER ERROR:", err.message);
    res.status(500).json({ error: "Failed to stop timer" });
  }
};

const getLogsByTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.userId });
    if (!task) return res.status(403).json({ error: "Unauthorized" });
    const logs = await TimeLog.find({ user: req.userId, task: req.params.taskId }).sort({ startTime: -1 });
    const totalSeconds = logs.filter(l => l.duration).reduce((s, l) => s + l.duration, 0);
    res.status(200).json({ logs, totalSeconds });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

const getDailySummary = async (req, res) => {
  try {
    const logs = await TimeLog.find({ user: req.userId, date: today() }).populate("task");
    const map = {};
    for (const log of logs) {
      if (!log.task) continue;
      const id = log.task._id.toString();
      if (!map[id]) map[id] = { ...log.task.toObject(), totalSeconds: 0 };
      if (log.duration) map[id].totalSeconds += log.duration;
    }
    const tasks = Object.values(map);
    res.status(200).json({
      date: today(),
      totalTrackedSeconds: tasks.reduce((s, t) => s + t.totalSeconds, 0),
      tasks,
      completed: tasks.filter(t => t.status === "Completed"),
      inProgress: tasks.filter(t => t.status === "In Progress"),
      pending: tasks.filter(t => t.status === "Pending"),
    });
  } catch (err) {
    console.error("SUMMARY ERROR:", err.message);
    res.status(500).json({ error: "Failed to get summary" });
  }
};

module.exports = { startTimer, stopTimer, getLogsByTask, getDailySummary };
