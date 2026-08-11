export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, age, time } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing on backend configuration.' });
    }

    // Active production model string
    const selectedModel = 'gemini-3.5-flash';

    const promptText = `Act as a supportive, empathetic child development expert.
Generate exactly 3 low-prep, low-mess, screen-free games.

Age Group: ${age || '4-5 Years'}
Available Items: ${items || 'household items'}
Time Frame: ${time || '30 Mins'}

CRITICAL INSTRUCTIONS:
- Do NOT include any introductory greeting or conversational intro text.
- Start IMMEDIATELY with the first game title using '###'.
- Format EVERY game strictly like this:

### Game Title
**Prep Time:** 1 Minute | **Mess Level:** Low | **Parent Energy Required:** Sit on Couch
**Objective:** One simple sentence objective.
**How to Play:**
* Step 1 explanation.
* Step 2 explanation.
* Step 3 explanation.
**Parent Perk:** Why this gives parents a breather.`;


    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(response.status || 400).json({ 
        error: data.error?.message || 'Gemini API returned an error' 
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error occurred' });
  }
}
