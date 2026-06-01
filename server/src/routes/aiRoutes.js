const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const aiController = require("../controllers/aiController");

router.use(verifyToken);
router.post("/enhance", aiController.enhanceTask);
router.post("/chat", aiController.chat);

module.exports = router;