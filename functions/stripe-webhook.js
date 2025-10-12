/* Netlify Function: stripe-webhook
   This handler verifies Stripe webhook signature and processes subscription events.
   Environment variables required:
     STRIPE_SECRET_KEY
     STRIPE_WEBHOOK_SECRET
     FIREBASE_SERVICE_ACCOUNT (JSON string)
*/
const stripeLib = require('stripe');
const admin = require('firebase-admin');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin with service account in env (use secure storage in production)
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({ credential: admin.credential.cert(svc) });
}

exports.handler = async function (event, context) {
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const rawBody = event.body;

  if (!stripe) {
    console.error('Stripe not configured');
    return { statusCode: 500, body: 'Stripe not configured' };
  }

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle checkout.session.completed
  if (evt.type === 'checkout.session.completed') {
    const session = evt.data.object;
    const uid = session.metadata?.uid || null;
    const subscriptionId = session.subscription;
    const customerEmail = session.customer_email;

    // Update Firestore user doc to set plan/subscription (if admin initialized)
    try {
      if (admin.apps.length && uid && uid !== 'guest') {
        const db = admin.firestore();
        await db.collection('users').doc(uid).set({
          plan: 'premium',
          stripeSubscriptionId: subscriptionId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (err) {
      console.error('Failed to update user plan in Firestore:', err);
    }
  }

  return { statusCode: 200, body: 'OK' };
};
