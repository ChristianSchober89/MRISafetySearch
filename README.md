# Run and deploy your AI Studio app (updated)

This repo has a frontend React app and a small backend proxy to call Google Gemini (Gemini API).
Do NOT embed your Gemini API key into the client. Run the provided server locally or deploy it server-side.

Prerequisites:
- Node.js

1. Install dependencies (frontend + backend):
   npm install

2. Start the Gemini proxy server (in one terminal)
   - Set GEMINI_API_KEY in your environment:
     export GEMINI_API_KEY="your_gemini_api_key"
   - Start server:
     node server.js
   (Server listens on port 3001 by default. You can set PORT env var.)

3. Start the frontend (in another terminal)
   npm run dev

Notes:
- The frontend calls POST /api/search — in local dev if your frontend runs on a different port set up a proxy in your dev server or use CORS.
- For production deploy the backend to a secure serverless function or server (e.g., Vercel Serverless Function / Heroku / Render) and point the frontend to that endpoint.
- Do NOT place GEMINI_API_KEY or any secret into client-side code.
