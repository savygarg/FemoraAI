const Assessment = require("../models/Assessment");
const {
  predictPcos,
  predictDiabetes,
  predictThyroid,
} = require("../services/aiServiceClient");

const runSinglePrediction = async (predictFn, features, res, disease) => {
  try {
    if (!features || typeof features !== "object") {
      return res.status(400).json({
        success: false,
        message: "features object is required",
      });
    }

    const result = await predictFn(features);

    return res.status(200).json({
      success: true,
      disease,
      result,
    });
  } catch (error) {
    console.error(`${disease} prediction error:`, error.message);

    return res.status(502).json({
      success: false,
      message: error.message || `Failed to run ${disease} prediction`,
    });
  }
};

const predictPcosHandler = (req, res) =>
  runSinglePrediction(predictPcos, req.body.features, res, "pcos");

const predictDiabetesHandler = (req, res) =>
  runSinglePrediction(predictDiabetes, req.body.features, res, "diabetes");

const predictThyroidHandler = (req, res) =>
  runSinglePrediction(predictThyroid, req.body.features, res, "thyroid");

const runFullAssessment = async (req, res) => {
  try {
    const { pcos = {}, diabetes = {}, thyroid = {} } = req.body;
    const userId = req.user.id;

    const [pcosResult, diabetesResult, thyroidResult] = await Promise.all([
      predictPcos(pcos),
      predictDiabetes(diabetes),
      predictThyroid(thyroid),
    ]);

    const assessment = await Assessment.create({
      userId,
      inputData: { pcos, diabetes, thyroid },
      results: {
        pcos: pcosResult,
        diabetes: diabetesResult,
        thyroid: thyroidResult,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Health assessment completed",
      assessment: {
        id: assessment.id,
        userId: assessment.userId,
        results: assessment.results,
        createdAt: assessment.createdAt,
      },
    });
  } catch (error) {
    console.error("Full assessment error:", error.message);

    return res.status(502).json({
      success: false,
      message: error.message || "Failed to complete health assessment",
    });
  }
};

const getLatestAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findLatestByUserId(req.user.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "No assessment found",
      });
    }

    return res.status(200).json({
      success: true,
      assessment: {
        id: assessment.id,
        userId: assessment.userId,
        results: assessment.results,
        createdAt: assessment.createdAt,
      },
    });
  } catch (error) {
    console.error("Get latest assessment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest assessment",
    });
  }
};

const getAssessmentHistory = async (req, res) => {
  try {
    const assessments = await Assessment.findByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      assessments: assessments.map((item) => ({
        id: item.id,
        userId: item.userId,
        results: item.results,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get assessment history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessment history",
    });
  }
};

module.exports = {
  predictPcosHandler,
  predictDiabetesHandler,
  predictThyroidHandler,
  runFullAssessment,
  getLatestAssessment,
  getAssessmentHistory,
};
