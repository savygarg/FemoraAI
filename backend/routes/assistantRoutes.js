const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { chat, getChats } = require("../controllers/assistantController");

const router = express.Router();

router.get("/chats", authMiddleware, getChats);
router.post("/chat", authMiddleware, chat);

module.exports = router;