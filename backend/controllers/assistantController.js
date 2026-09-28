const Groq = require("groq-sdk");
const AssistantChat = require("../models/AssistantChat");

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

    try {
      await AssistantChat.appendMessages(req.user.id, [
        { role: "user", content: message.trim(), createdAt: new Date() },
        { role: "assistant", content: reply, createdAt: new Date() },
      ]);
    } catch (error) {
      console.error("Assistant chat persistence error:", error.message);
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

const getChats = async (req, res) => {
  try {
    const messages = await AssistantChat.findByUserId(req.user.id);
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Assistant chat history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load previous assistant chats",
    });
  }
};

module.exports = {
  chat,
  getChats,
};