const { getDB } = require("../config/db");

const COLLECTION_NAME = "blood_reports";

const create = async ({
  userId,
  originalFileName,
  filePath,
  extractedResults = {},
  aiSummary = null,
}) => {
  const db = getDB();

  const bloodReport = {
    id: Date.now().toString(),
    userId,
    originalFileName,
    filePath,
    uploadedAt: new Date().toISOString(),
    extractedResults,
    aiSummary,
  };

  await db.collection(COLLECTION_NAME).insertOne(bloodReport);

  return bloodReport;
};

const findByUserId = async (userId) => {
  const db = getDB();

  return await db
    .collection(COLLECTION_NAME)
    .find({ userId })
    .sort({ uploadedAt: -1 })
    .toArray();
};

const findByIdAndUserId = async (id, userId) => {
  const db = getDB();

  return await db.collection(COLLECTION_NAME).findOne({ id, userId });
};

module.exports = {
  create,
  findByUserId,
  findByIdAndUserId,
};
