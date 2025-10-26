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

// --- Perplexity endpoints ---
app.get("/api/perplexity/status", (_req, res) => {
  res.json({ status: "ok", message: "Perplexity backend is active ✅" });
});

app.post("/api/perplexity/ask", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send("Prompt is required");

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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

    res.send(text);
  } catch (error) {
    console.error("Perplexity API error:", error);
    res.status(500).send("Error connecting to Perplexity API");
  }
});

// --- Ollama endpoints ---
app.get("/api/ollama/status", (_req, res) => {
  res.json({ status: "ok", message: "Ollama backend is running ✅" });
});

app.post("/api/ollama/generate", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const ollamaApiUrl = process.env.OLLAMA_HOST || "http://127.0.0.1:11434/api/generate";

    const response = await fetch(ollamaApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3.2:latest", prompt: query, stream: false }),
    });

    const data: OllamaResponse = await response.json();
    res.json({ completion: data.response || "No response from Ollama" });
  } catch (error) {
    console.error("Ollama API error:", error);
    res.status(500).send("Error connecting to Ollama API");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
