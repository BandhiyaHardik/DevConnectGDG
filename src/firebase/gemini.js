/**
 * Fetches ongoing/upcoming hackathons from Gemini API.
 * Returns an array of hackathon objects: { title, date, location, description }
 */
export async function fetchHackathonsFromGemini() {
  // For Vite use VITE_GEMINI_API_KEY, for CRA use REACT_APP_GEMINI_API_KEY
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  const prompt = "List 5 ongoing or upcoming hackathons worldwide with their name, date, location, and a short description. Format as JSON array with fields: title, date, location, description.";

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const res = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    // Gemini returns a text field, which should be a JSON array
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return [];
    // Parse the JSON array from Gemini's response
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini API error:", e);
    return [];
  }
}