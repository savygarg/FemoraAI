const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

function getFilePath(fileName) {
  return path.join(dataDirectory, `${fileName}.json`);
}

function readData(fileName) {
  const filePath = getFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
    return [];
  }
}

function writeData(fileName, data) {
  const filePath = getFilePath(fileName);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

module.exports = {
  readData,
  writeData
};