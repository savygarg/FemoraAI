const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  predictPcosHandler,
  predictDiabetesHandler,
  predictThyroidHandler,
  runFullAssessment,
  getLatestAssessment,
  getAssessmentHistory,
} = require("../controllers/predictionController");

const router = express.Router();

router.post("/pcos", authMiddleware, predictPcosHandler);
router.post("/diabetes", authMiddleware, predictDiabetesHandler);
router.post("/thyroid", authMiddleware, predictThyroidHandler);
router.post("/assessment", authMiddleware, runFullAssessment);
router.get("/latest", authMiddleware, getLatestAssessment);
router.get("/history", authMiddleware, getAssessmentHistory);

module.exports = router;
