const { getDB } = require("../config/db");

const COLLECTION_NAME = "health_assessments";

const create = async ({ userId, inputData, results }) => {
  const db = getDB();

  const assessment = {
    id: Date.now().toString(),
    userId,
    inputData,
    results,
    createdAt: new Date().toISOString(),
  };

  await db.collection(COLLECTION_NAME).insertOne(assessment);

  return assessment;
};

const findLatestByUserId = async (userId) => {
  const db = getDB();

  return await db.collection(COLLECTION_NAME).findOne(
    { userId },
    { sort: { createdAt: -1 } }
  );
};

const findByUserId = async (userId, limit = 10) => {
  const db = getDB();

  return await db
    .collection(COLLECTION_NAME)
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
};

module.exports = {
  create,
  findLatestByUserId,
  findByUserId,
};
