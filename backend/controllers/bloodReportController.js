const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const BloodReport = require("../models/BloodReport");
const { createBloodReportSummary } = require("../services/bloodReportSummaryService");

const MARKER_DEFINITIONS = [
  { name: "Hemoglobin", pattern: "Hemoglobin", unit: "g/dL", range: "12.0 – 15.5", low: 12, high: 15.5 },
  { name: "WBC Count", pattern: "(?:Total\\s+)?WBC\\s+Count", unit: "/µL", range: "4,000 – 11,000", low: 4000, high: 11000 },
  { name: "Platelet Count", pattern: "Platelet\\s+Count", unit: "lakh/µL", range: "1.50 – 4.50", low: 1.5, high: 4.5 },
  { name: "Glucose", pattern: "(?:Fasting\\s+Blood\\s+)?Glucose", unit: "mg/dL", range: "70 – 100", low: 70, high: 100 },
  { name: "Vitamin B12", pattern: "Vitamin\\s+B12", unit: "pg/mL", range: "200 – 900", low: 200, high: 900 },
  { name: "Vitamin D", pattern: "Vitamin\\s+D(?:\\s*\\([^)]*\\))?", unit: "ng/mL", range: "30 – 100", low: 30, high: 100 },
];

const getStatus = (value, definition) => {
  if (value === "Not found") return "Not found";

  const numericValue = Number(value.replace(/,/g, ""));
  if (numericValue < definition.low) return "Low";
  if (numericValue > definition.high) return "High";
  return "Normal";
};

const extractResults = (text) =>
  MARKER_DEFINITIONS.map((definition) => {
    const match = text.match(new RegExp(`(?:${definition.pattern})\\s*(?:[:=-]\\s*)?([0-9][0-9,]*(?:\\.[0-9]+)?)`, "i"));
    const value = match ? match[1] : "Not found";

    return {
      name: definition.name,
      value,
      unit: definition.unit,
      range: definition.range,
      status: getStatus(value, definition),
    };
  });

const extractPdfResults = async (filePath) => {
  const pdfBuffer = await fs.promises.readFile(filePath);
  const parser = new PDFParse({ data: pdfBuffer });

  try {
    const result = await parser.getText();
    return extractResults(result.text || "");
  } finally {
    await parser.destroy();
  }
};

const createBloodReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "A PDF, JPG, JPEG, or PNG file is required",
      });
    }

    const isPdf =
      req.file.mimetype === "application/pdf" ||
      path.extname(req.file.originalname).toLowerCase() === ".pdf";
    const extractedResults = isPdf
      ? await extractPdfResults(req.file.path)
      : [];
    const aiSummary = createBloodReportSummary(extractedResults);

    const bloodReport = await BloodReport.create({
      userId: req.user.id,
      originalFileName: req.file.originalname,
      filePath: req.file.path,
      extractedResults,
      aiSummary,
    });

    return res.status(201).json({
      success: true,
      message: "Blood report record created",
      bloodReport,
    });
  } catch (error) {
    console.error("Create blood report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create blood report record",
    });
  }
};

const getBloodReports = async (req, res) => {
  try {
    const bloodReports = await BloodReport.findByUserId(req.user.id);

    const reportsWithSummaries = bloodReports.map((report) => ({
      ...report,
      aiSummary: report.aiSummary || createBloodReportSummary(report.extractedResults),
    }));

    return res.status(200).json({
      success: true,
      bloodReports: reportsWithSummaries,
    });
  } catch (error) {
    console.error("Get blood reports error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blood reports",
    });
  }
};

const getBloodReport = async (req, res) => {
  try {
    const bloodReport = await BloodReport.findByIdAndUserId(
      req.params.id,
      req.user.id
    );

    if (!bloodReport) {
      return res.status(404).json({
        success: false,
        message: "Blood report not found",
      });
    }

    const reportWithSummary = {
      ...bloodReport,
      aiSummary:
        bloodReport.aiSummary || createBloodReportSummary(bloodReport.extractedResults),
    };

    return res.status(200).json({
      success: true,
      bloodReport: reportWithSummary,
    });
  } catch (error) {
    console.error("Get blood report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blood report",
    });
  }
};

module.exports = {
  createBloodReport,
  getBloodReports,
  getBloodReport,
};
