const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");

router.use(verifyToken);
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;