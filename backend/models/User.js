const { getDB } = require("../config/db");

const COLLECTION_NAME = "users";

const findByEmail = async (email) => {
  const db = getDB();

  return await db.collection(COLLECTION_NAME).findOne({
    email: email.toLowerCase()
  });
};

const findById = async (id) => {
  const db = getDB();

  return await db.collection(COLLECTION_NAME).findOne({
    id
  });
};

const create = async ({ name, email, password }) => {
  const db = getDB();

  const newUser = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
    profile: {},
  };

  await db.collection(COLLECTION_NAME).insertOne(newUser);

  return newUser;
};

const updateProfile = async (id, profile) => {
  const db = getDB();

  await db.collection(COLLECTION_NAME).updateOne(
    { id },
    {
      $set: {
        profile,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  return await findById(id);
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateProfile,
};