const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { startTimer, stopTimer, getLogsByTask, getDailySummary } = require("../controllers/timeLogController");

router.use(verifyToken);
router.post("/start/:taskId", startTimer);
router.put("/stop/:logId", stopTimer);
router.get("/task/:taskId", getLogsByTask);
router.get("/summary/daily", getDailySummary);

module.exports = router;