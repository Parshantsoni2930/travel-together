const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAISuggestions = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const conversation = history
      .filter((msg) => msg.text)
      .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n");

    const prompt = `
You are a friendly AI travel buddy inside a Travel Buddy Finder app.
Talk casually like a helpful friend.
Ask follow-up questions when needed.
Keep replies short and natural.

Conversation so far:
${conversation}

User's latest message:
${query}

AI:
`;

    const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    });
    let reply = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        reply = result.response.text();
        break;
      } catch (err) {
        lastError = err;
        console.log(`${modelName} failed:`, err.message);
      }
    }

    if (!reply) {
      throw lastError;
    }

    res.json({ reply });
  } catch (error) {
    console.log("GEMINI ERROR:", error.message);

    res.status(500).json({
      message: "Gemini AI error",
      error: error.message,
    });
  }
};

module.exports = { getAISuggestions };