const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAISuggestions = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key missing on server",
      });
    }

    if (!query) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const conversation = history
      .filter((msg) => msg.text)
      .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n");

    const prompt = `
You are a friendly AI travel buddy inside a Travel Buddy Finder website.
Talk casually like a helpful friend.
Give practical travel plans, routes, budget, places to visit, food suggestions and safety tips.
Keep replies clear and useful.

Conversation so far:
${conversation}

User:
${query}

AI:
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log("GEMINI ERROR:", error.message);

    return res.status(200).json({
      reply:
        "AI is temporarily busy. For demo, here is a sample travel plan:\n\nDay 1: Arrival, local sightseeing, cafes and market.\nDay 2: Main attractions, adventure activity and sunset point.\nDay 3: Nearby places, shopping and return.\n\nTip: Share destination, days and budget for a better plan.",
    });
  }
};

module.exports = { getAISuggestions };