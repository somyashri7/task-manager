const Groq = require("groq-sdk");
const Task = require("../models/Task");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const enhanceTask = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "Input required" });
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You are a productivity assistant. Given a rough task description, return ONLY a valid JSON object with exactly two keys: title and description. No markdown, no backticks, just JSON." },
        { role: "user", content: input },
      ],
      max_tokens: 150,
    });
    const raw = completion.choices[0].message.content.trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const parsed = JSON.parse(raw.substring(start, end + 1));
    res.status(200).json(parsed);
  } catch (err) {
    console.error("ENHANCE ERROR:", err.message);
    res.status(500).json({ error: "AI enhancement failed" });
  }
};

const chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });
    const tasks = await Task.find({ user: req.userId });
    const taskSummary = tasks.length === 0
      ? "The user has no tasks yet."
      : tasks.map(t => "- " + t.title + " | Status: " + t.status + " | Priority: " + t.priority).join("\n");
    const systemPrompt = "You are a smart productivity assistant in a task manager app. User tasks:\n\n" + taskSummary + "\n\nBe concise, friendly, and practical.";
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message }
    ];
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages,
      max_tokens: 400,
    });
    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("CHAT ERROR:", err.message);
    res.status(500).json({ error: "Chat failed" });
  }
};

module.exports = { enhanceTask, chat };
