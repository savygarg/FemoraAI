const { AI_SERVICE_URL } = require("../config/aiService");

async function callAiService(path, payload) {
  const response = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ features: payload }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.detail || data.message || `AI service error (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function predictPcos(features) {
  const data = await callAiService("/predict/pcos", features);
  return data.result;
}

async function predictDiabetes(features) {
  const data = await callAiService("/predict/diabetes", features);
  return data.result;
}

async function predictThyroid(features) {
  const data = await callAiService("/predict/thyroid", features);
  return data.result;
}

module.exports = {
  predictPcos,
  predictDiabetes,
  predictThyroid,
};
