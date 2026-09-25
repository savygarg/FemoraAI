const express = require("express");

const {
  registerUser,
  loginUser,
  getMe
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Current user
router.get("/me", authMiddleware, getMe);

module.exports = router;