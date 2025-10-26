const express = require('express');

let OpenAI;
try {
  OpenAI = require('openai');
} catch (e) {
  OpenAI = null;
}

module.exports = function registerAiRoutes(app) {
  const router = express.Router();

  router.post('/chat', async (req, res) => {
    try {
      if (!OpenAI) {
        return res.status(500).json({ error: 'OpenAI SDK not installed on server.' });
      }
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY not configured.' });
      }

      const { messages = [], model = 'gpt-4o-mini' } = req.body || {};
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages array required' });
      }

      const client = new OpenAI({ apiKey });

      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 500,
      });

      const reply = completion?.choices?.[0]?.message?.content || '';
      return res.json({ reply });
    } catch (err) {
      console.error('[AI] chat error:', err);
      return res.status(500).json({ error: 'Failed to get AI response' });
    }
  });

  app.use('/api/ai', router);
};