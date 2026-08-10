export default async function handler(req, res) {
  // 1. Guard clause for request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Start of safety net
  try {
    const { items, age, time, model } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on server' });
    }

    const selectedModel = model || 'gemini-1.5-flash';
    const promptText = `Act as a supportive, empathetic child developer...
    - Age Group: ${age || '4-5 Years'}
    - Available Items: ${items || 'household items'}
    - Time Frame: ${time || '30 Minutes'}`;

    // --- YOUR GOOGLE API CALL CODE GOES HERE ---
    // (e.g., const response = await fetch(...); or await ai.generate(...);)

    // Send successful response back to app
    return res.status(200).json({ result: data });

  } catch (error) {
    // 3. End of safety net: Catches any crashes above
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
}
