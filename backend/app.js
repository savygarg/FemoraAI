require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const bloodReportRoutes = require("./routes/bloodReportRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FemoraAI Backend API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Profile routes
app.use("/api/profile", profileRoutes);

// Prediction routes
app.use("/api/predictions", predictionRoutes);

// Blood report routes
app.use("/api/blood-reports", bloodReportRoutes);

// Authenticated conversational assistant endpoint
app.use("/api/assistant", assistantRoutes);

// Authenticated journal routes
app.use("/api/journal", journalRoutes);

module.exports = app;