const Groq = require("groq-sdk");

const MODEL = "openai/gpt-oss-120b";
const SYSTEM_PROMPT = `You are FemoraAI's health-information assistant. Provide understandable general health information, not diagnoses. Do not claim certainty, prescribe medication, or tell users to change prescribed medication. Clearly separate general information from details provided by the user, and never invent medical results, history, or personal information. Encourage professional medical care when symptoms need evaluation, and recommend urgent or emergency care for potentially serious symptoms.`;

const chat = async (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "A question or message is required",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "The assistant is temporarily unavailable",
    });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() },
      ],
    });

    const reply = response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "The assistant returned an empty response",
      });
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Assistant chat error:", error.message);
    return res.status(502).json({
      success: false,
      message: "The assistant is temporarily unavailable",
    });
  }
};

module.exports = {
  chat,
};