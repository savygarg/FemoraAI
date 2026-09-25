const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in your .env file");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("FemoraAI");

    console.log("✅ MongoDB connected successfully");

    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }

  return db;
}

module.exports = {
  connectDB,
  getDB
};