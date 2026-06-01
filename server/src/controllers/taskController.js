const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const task = await Task.create({ user: req.userId, title, description, status, priority, dueDate });
    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err.message);
    res.status(500).json({ error: "Failed to create task" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });
    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err.message);
    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
