const JournalEntry = require("../models/JournalEntry");
const { getAutomatedInsight } = require("../services/journalInsightService");

const normalizeSymptoms = (symptoms) => {
  if (!Array.isArray(symptoms)) return [];

  return symptoms
    .filter((symptom) => typeof symptom === "string")
    .map((symptom) => symptom.trim())
    .filter(Boolean)
    .slice(0, 20);
};

const createJournalEntry = async (req, res) => {
  try {
    const { date, notes = "" } = req.body || {};
    const symptoms = normalizeSymptoms(req.body?.symptoms);

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "A valid journal date is required",
      });
    }

    if (typeof notes !== "string" || notes.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Notes must be text with a maximum length of 5000 characters",
      });
    }

    const automatedInsight = getAutomatedInsight({ symptoms, notes });
    const entry = await JournalEntry.create({
      userId: req.user.id,
      date,
      symptoms,
      notes: notes.trim(),
      automatedInsight,
    });

    return res.status(201).json({
      success: true,
      message: "Journal entry saved",
      entry,
    });
  } catch (error) {
    console.error("Create journal entry error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save journal entry",
    });
  }
};

const getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.findByUserId(req.user.id);
    return res.status(200).json({ success: true, entries });
  } catch (error) {
    console.error("Get journal entries error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch journal entries",
    });
  }
};

const getJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findByIdAndUserId(req.params.id, req.user.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    return res.status(200).json({ success: true, entry });
  } catch (error) {
    console.error("Get journal entry error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch journal entry",
    });
  }
};

module.exports = {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
};
