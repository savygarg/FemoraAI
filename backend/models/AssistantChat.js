const { getDB } = require("../config/db");

const COLLECTION_NAME = "assistant_chats";
let indexPromise;

const getCollection = async () => {
  const collection = getDB().collection(COLLECTION_NAME);

  if (!indexPromise) {
    indexPromise = collection
      .createIndex({ userId: 1 }, { unique: true })
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }

  await indexPromise;
  return collection;
};

const findByUserId = async (userId) => {
  const collection = await getCollection();
  const chat = await collection.findOne(
    { userId },
    { projection: { messages: 1 } }
  );

  return chat?.messages || [];
};

const appendMessages = async (userId, messages) => {
  const collection = await getCollection();
  const now = new Date();

  await collection.updateOne(
    { userId },
    {
      $setOnInsert: { createdAt: now },
      $set: { updatedAt: now },
      $push: { messages: { $each: messages } },
    },
    { upsert: true }
  );
};

module.exports = {
  findByUserId,
  appendMessages,
};