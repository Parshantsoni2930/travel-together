const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getAISuggestions = async (req, res) => {
  try {
    const { query, history = [] } =
      req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a friendly AI travel planner inside Travel Buddy Finder. Give practical travel plans with itinerary, budget, routes, food, safety tips and packing tips.",
      },
    ];

    if (Array.isArray(history)) {
      history
        .slice(-10)
        .forEach((msg) => {
          if (msg?.text) {
            messages.push({
              role:
                msg.role === "user"
                  ? "user"
                  : "assistant",
              content: msg.text,
            });
          }
        });
    }

    messages.push({
      role: "user",
      content: query.trim(),
    });

    const completion =
      await groq.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
      });

    const reply =
      completion.choices[0]?.message
        ?.content ||
      "No response generated.";

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log(
      "GROQ ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "AI service temporarily unavailable",
    });
  }
};

module.exports = {
  getAISuggestions,
};