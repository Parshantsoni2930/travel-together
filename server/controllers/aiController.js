const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAISuggestions = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key missing" });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

    const conversation = history
      .filter((msg) => msg?.text)
      .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n");

    const prompt = `
You are a friendly AI travel planner inside Travel Buddy Finder.
Create practical trip plans with itinerary, budget, routes, food, places and safety tips.
Keep it clear and useful.

Conversation:
${conversation}

User request:
${query}

AI:
`;

    const modelNames = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-pro",
    ];

    let reply = null;
    let lastError = null;

    for (const modelName of modelNames) {
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

    if (!reply) throw lastError;

    return res.status(200).json({ reply });
  } catch (error) {
    console.log("GEMINI ERROR:", error.message);

    return res.status(500).json({
      message: "Gemini AI error",
      error: error.message,
    });
  }
};

module.exports = { getAISuggestions };