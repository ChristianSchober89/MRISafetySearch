import type { SearchResult } from "../types";

/**
 * Client-side wrapper: call the server endpoint which interacts with Gemini.
 * Keeps the API key on the server and avoids loading server SDKs in the browser.
 */
export const fetchMRISafetyInfo = async (implantName: string): Promise<SearchResult> => {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ implantName }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search API error: ${res.status} ${text}`);
  }

  const data: SearchResult = await res.json();
  return data;
};
