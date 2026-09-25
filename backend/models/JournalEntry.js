const { getDB } = require("../config/db");

const COLLECTION_NAME = "journal_entries";

const create = async ({ userId, date, symptoms, notes, automatedInsight }) => {
  const db = getDB();
  const entry = {
    id: Date.now().toString(),
    userId,
    date,
    symptoms,
    notes,
    automatedInsight,
    createdAt: new Date().toISOString(),
  };

  await db.collection(COLLECTION_NAME).insertOne(entry);
  return entry;
};

const findByUserId = async (userId) => {
  const db = getDB();

  return db
    .collection(COLLECTION_NAME)
    .find({ userId })
    .sort({ date: 1, createdAt: 1 })
    .toArray();
};

const findByIdAndUserId = async (id, userId) => {
  const db = getDB();
  return db.collection(COLLECTION_NAME).findOne({ id, userId });
};

module.exports = {
  create,
  findByUserId,
  findByIdAndUserId,
};
