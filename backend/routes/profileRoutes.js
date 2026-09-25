const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  saveProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, saveProfile);

module.exports = router;
