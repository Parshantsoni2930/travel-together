const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAISuggestions = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key missing on server",
      });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

    const conversation = history
      .filter((msg) => msg?.text)
      .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
      .join("\n");

    const prompt = `
You are an AI travel planner inside a Travel Buddy Finder website.

Your job:
- Make helpful travel plans
- Suggest itinerary day-wise
- Suggest budget, routes, places, food and safety tips
- Keep answer clear, useful and friendly
- Use simple language
- Avoid very long paragraphs

Conversation so far:
${conversation}

User request:
${query}

Give the best travel plan:
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log("GEMINI ERROR:", error.message);

    return res.status(500).json({
      message: "Gemini AI error",
      error: error.message,
    });
  }
};

module.exports = { getAISuggestions };