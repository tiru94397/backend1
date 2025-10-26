import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

interface OllamaResponse {
  response?: string;
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Health check
app.get("/api/perplexity/status", (_req, res) => {
  res.json({ status: "ok", message: "Perplexity backend is active ✅" });
});

// Main Perplexity AI endpoint
app.post("/api/perplexity/ask", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send("Prompt is required");

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
=======
app.get("/api/ollama/status", (req, res) => {
  res.json({ status: "ok", message: "Backend is running ✅" });
});

app.post("/api/ollama/generate", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const ollamaApiUrl = process.env.OLLAMA_HOST || "http://127.0.0.1:11434/api/generate";

    const response = await fetch(ollamaApiUrl, {
>>>>>>> ca14ff95e2841eea5a2d965fa6db4203d00c541f
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
<<<<<<< HEAD
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are Tiru AI — a friendly, concise AI assistant.
Always reply with clean, short, human-like text.
Do not include markdown, JSON, quotes, or extra explanation.`,
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || "No response from Perplexity";

    res.send(text); // ✅ Plain text reply
=======
        model: "llama3.2:latest",
        prompt: query,
        stream: false,
      }),
    });

    const data: OllamaResponse = (await response.json()) as OllamaResponse;
    res.json({ completion: data.response || "No response from Ollama" });
>>>>>>> ca14ff95e2841eea5a2d965fa6db4203d00c541f
  } catch (error) {
    console.error("Perplexity API error:", error);
    res.status(500).send("Error connecting to Perplexity API");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Perplexity backend running at http://localhost:${PORT}`);
});
