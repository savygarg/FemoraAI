const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
} = require("../controllers/journalController");

const router = express.Router();

router.post("/", authMiddleware, createJournalEntry);
router.get("/", authMiddleware, getJournalEntries);
router.get("/:id", authMiddleware, getJournalEntry);

module.exports = router;
