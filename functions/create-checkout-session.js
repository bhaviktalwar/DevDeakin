/* Netlify Function: create-checkout-session
   Expects POST JSON: { priceId, uid?, email? }
   Environment variables required:
     STRIPE_SECRET_KEY - your Stripe secret key
     CLIENT_URL - your front-end origin (used for success/cancel URLs)
*/
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const priceId = body.priceId;
    const uid = body.uid || null;
    const email = body.email || null;

    if (!priceId) return { statusCode: 400, body: 'Missing priceId' };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/?checkout=cancel`,
      metadata: { uid: uid || 'guest' },
      customer_email: email || undefined,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error('create-checkout-session error', err);
    return { statusCode: 500, body: String(err.message || err) };
  }
};
