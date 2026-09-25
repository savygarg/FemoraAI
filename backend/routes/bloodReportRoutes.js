const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBloodReport,
  getBloodReports,
  getBloodReport,
} = require("../controllers/bloodReportController");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..", "uploads", "blood-reports");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      callback(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
    }

    return callback(null, true);
  },
});

const uploadSingleReport = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File size must be less than 10 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid blood report upload",
    });
  });
};

router.post("/", authMiddleware, uploadSingleReport, createBloodReport);
router.get("/", authMiddleware, getBloodReports);
router.get("/:id", authMiddleware, getBloodReport);

module.exports = router;
