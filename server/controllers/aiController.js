const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log(
  process.env.GEMINI_API_KEY?.slice(0, 10)
);

const getAISuggestions = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key missing",
      });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY.trim()
    );

    const safeHistory = Array.isArray(history)
      ? history
          .filter((msg) => msg?.text)
          .slice(-10)
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`
          )
          .join("\n")
      : "";

    const prompt = `
You are a friendly AI travel planner inside Travel Buddy Finder.

Give a practical travel plan with:
- short overview
- day-wise itinerary
- estimated budget
- best route/transport
- food suggestions
- safety tips
- packing tips

Keep the answer clear, helpful, and easy to read.

Conversation:
${safeHistory}

User request:
${query.trim()}

AI:
`;

 const modelNames = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
];

    let reply = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent(prompt);

        reply = result.response.text();

        if (reply) break;
      } catch (error) {
        lastError = error;
        console.log(`${modelName} failed:`, error.message);
      }
    }

    if (!reply) {
      throw lastError || new Error("No AI reply generated");
    }

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log("GEMINI ERROR:", error.message);

    return res.status(200).json({
      reply:
        "AI service abhi temporary issue de raha hai.",
    });
  }
};

module.exports = {
  getAISuggestions,
};