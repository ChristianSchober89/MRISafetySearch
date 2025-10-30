// Simple Express server that proxies requests to Google GenAI (Gemini).
// Run this server separately (node server.js) and set GEMINI_API_KEY in the environment.
//
// Install server deps:
//   npm install express body-parser @google/genai
//
// Example usage:
//   export GEMINI_API_KEY="your_key_here"
//   node server.js
//
const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenAI } = require("@google/genai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set. Exiting.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Simple CORS for local dev; tighten in production.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post("/api/search", async (req, res) => {
  try {
    const { implantName } = req.body || {};
    if (!implantName || typeof implantName !== "string") {
      return res.status(400).send("implantName is required");
    }

    const model = "gemini-2.5-flash";
    const prompt = `
You are an expert assistant for MRI safety. Based on the medical implant "${implantName}", use Google Search to find its MRI safety information.

Your response MUST be a single, raw JSON object and nothing else. Do not use markdown backticks or any other formatting.

The JSON object must conform to the following structure:
{
  "deviceName": "string",
  "manufacturer": "string",
  "safety": "MR Safe | MR Conditional | MR Unsafe | Unknown",
  "conditionalGuidelines": {
    "staticMagneticField": "string or null",
    "spatialGradientField": "string or null",
    "sarLimit": "string or null",
    "notes": "string or null"
  },
  "risksAndArtifacts": "string or null",
  "waitingPeriod": "string or null",
  "disclaimer": "string or null",
  "sources": [
    {
      "web": { "title": "string", "uri": "string" },
      "excerpt": "string or null"
    }
  ]
}
    `.trim();

    // NOTE: SDK call shape may vary by version. Adapt if your SDK version uses a different method.
    const response = await ai.generate({
      model,
      prompt: [
        { role: "user", content: prompt }
      ],
      maxOutputTokens: 800
    });

    const text = (response?.candidates?.[0]?.content ?? "").trim();
    if (!text) {
      return res.status(500).send("Empty response from Gemini");
    }

    // Try to parse JSON; if Gemini returns extra text, extract the first JSON object block.
    let payload;
    try {
      payload = JSON.parse(text);
    } catch (err) {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error("Failed to parse JSON from Gemini response:", text);
        return res.status(500).send("Failed to parse JSON from Gemini response");
      }
      payload = JSON.parse(match[0]);
    }

    return res.json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).send(String(err.message || err));
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy server listening on http://localhost:${PORT}`);
});
