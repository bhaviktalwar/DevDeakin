// Netlify Function for AI chat endpoint
// Endpoint: /.netlify/functions/ai-chat
// Mapped to: /api/ai/chat via redirects

// OpenAI SDK v4 uses a default export in CommonJS. Do NOT destructure.
const OpenAI = require('openai');

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true, message: 'AI chat function is deployed. Use POST to chat.' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured in Netlify environment variables');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'OPENAI_API_KEY not configured.' })
      };
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body.' })
      };
    }
    const { messages = [], model = 'gpt-4o-mini' } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'messages array required' })
      };
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 500,
    });

    const reply = completion?.choices?.[0]?.message?.content || '';
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error('[AI Function] error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to get AI response',
        details: err.message 
      })
    };
  }
};
