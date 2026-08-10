export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, age, time, model } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing on backend configuration.' });
  }

  const selectedModel = model || 'gemini-2.5-flash';

  const promptText = `Act as a supportive, empathetic child development expert.
Generate 3 low-prep, low-mess, screen-free games.
Age Group: ${age}
Available Items: ${items}
Time Frame: ${time}

Format each game precisely like this:
### Game Title
**Prep Time:** [e.g. 1 Minute] | **Mess Level:** [e.g. Zero / Low] | **Parent Energy Required:** [e.g. Sit on Couch]
**Objective:** Short 1-sentence summary.
**How to Play:**
* Step 1
* Step 2
* Step 3
**Parent Perk:** Why this gives parents a breather or quick win.`;

  try {
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

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
}
