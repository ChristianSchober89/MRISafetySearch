import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, SearchResult, StructuredSafetyInfo } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchMRISafetyInfo = async (implantName: string): Promise<SearchResult> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are an expert assistant for MRI safety. Based on the medical implant "${implantName}", use Google Search to find its MRI safety information.
    
    Your response MUST be a single, raw JSON object and nothing else. Do not use markdown backticks or any other formatting.
    
    The JSON object must conform to the following structure:
    {
      "deviceName": "string", // The specific name of the medical implant.
      "manufacturer": "string", // The manufacturer of the implant. Can be "Unknown" if not found.
      "safetyClassification": "'MR Safe' | 'MR Conditional' | 'MR Unsafe' | 'Unknown'",
      "summary": "string", // A concise summary of the MRI safety information, formatted as Markdown.
      "conditionalGuidelines": { // Null if not "MR Conditional".
        "staticMagneticField": "string", // e.g., "1.5T and 3T"
        "spatialGradientField": "string", // e.g., "≤ 4,000 gauss/cm (40 T/m)"
        "sarLimit": "string", // e.g., "≤ 2.0 W/kg"
        "notes": "string" // Other important conditional guidelines or notes, formatted as Markdown.
      } | null,
      "risksAndArtifacts": "string", // Description of potential risks (heating, torque) and image artifacts, formatted as Markdown.
      "waitingPeriod": "string", // Required waiting period after implantation before an MRI can be performed. Formatted as Markdown. Can be "N/A"
      "disclaimer": "string" | null // A disclaimer to show if the exact information could not be found and general advice is provided instead. Null if specific info was found.
    }

    If you cannot find information for the exact device, provide information for a similar class of devices and include a clear disclaimer in the 'disclaimer' field.
    The primary goal is to provide clear, actionable information for healthcare professionals.
    Ensure all string fields intended for display are properly formatted with Markdown where appropriate (e.g., lists, bold text).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are not supported when using tools,
        // so we instruct the model to return JSON in the prompt itself.
      },
    });

    const jsonText = response.text.trim();
    // In case the model wraps the JSON in markdown, remove it.
    const cleanedJsonText = jsonText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    const data: StructuredSafetyInfo = JSON.parse(cleanedJsonText);

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(
        (chunk: any): chunk is GroundingChunk => chunk.web && chunk.web.uri && chunk.web.title
    ) || [];

    return { data, sources };
  } catch (error) {
    console.error("Gemini API call failed or JSON parsing failed:", error);
    throw new Error("Failed to fetch or parse data from Gemini API.");
  }
};
