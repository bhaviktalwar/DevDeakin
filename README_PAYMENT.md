Stripe + Serverless payment setup (DEV@Deakin)

This document explains how to deploy the provided serverless functions and wire the frontend `Payment.jsx` to process premium subscriptions using Stripe Checkout.

Files added:
- `functions/create-checkout-session.js` — Netlify function that creates a Stripe Checkout Session. Expects POST JSON { priceId, uid?, email? }.
- `functions/stripe-webhook.js` — Netlify webhook receiver for Stripe events (checkout.session.completed) and example Firestore update using Firebase Admin.

Environment variables (set on Netlify/Vercel or your server environment):
- STRIPE_SECRET_KEY  — your Stripe secret key (starts with sk_...)
- STRIPE_WEBHOOK_SECRET — the webhook signing secret from Stripe (for verifying incoming webhooks)
- STRIPE_PUBLISHABLE_KEY — used by frontend (starts with pk_...)
- REACT_APP_STRIPE_PREMIUM_PRICE_ID — price ID for your subscription (e.g. price_xxx)
- CLIENT_URL — your frontend URL (e.g. https://your-site.netlify.app)
- FIREBASE_SERVICE_ACCOUNT — JSON string of your service account credentials (only required if you want the webhook to write to Firestore)

How it works
1. Frontend (Payment.jsx) POSTs to the serverless function `/api/create-checkout-session` (Netlify path: `/.netlify/functions/create-checkout-session`).
2. The function calls Stripe's API to create a Checkout Session (mode: subscription) and returns the session id.
3. Frontend calls `stripe.redirectToCheckout({ sessionId })` which opens Stripe Checkout.
4. After successful payment, Stripe calls your webhook. The webhook verifies the signature and updates Firestore user document (example code provided).

Testing locally
- You can test the frontend behavior locally but you need a deployed serverless function or to run a local server that proxies calls to Stripe.
- For webhooks, use Stripe CLI to forward events to your webhook URL while developing.

Security notes
- Never put your Stripe secret key or Firebase service account in client-side code.
- Use environment variables and serverless function configuration to keep secrets safe.

Deployment hints
- On Netlify: Put `functions` folder at project root and configure environment variables in Netlify UI. The function URL will be `/.netlify/functions/<name>`.
- On Vercel: create `api/create-checkout-session.js` using the same handler code (export default) and set ENV vars in Vercel dashboard.

If you want, I can:
- Add an Express server example instead of Netlify functions.
- Wire the Payment UI to send the current user's UID/email to the create-checkout-session function (it will be saved to session metadata).
- Add Stripe webhook handling example with more event types (invoice.paid, customer.subscription.updated, etc.).

Example environment variables (Netlify/Vercel):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_12345
CLIENT_URL=https://your-site.netlify.app
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_SERVICE_ACCOUNT={...JSON...}
```

Testing with Stripe CLI (webhooks):

1. Install Stripe CLI and login: `stripe login`
2. Forward events to your webhook endpoint while running your server/deployment: `stripe listen --forward-to https://your-site.netlify.app/.netlify/functions/stripe-webhook`
3. Trigger a test Checkout Session succeeded event (or run a real checkout and pay using Stripe test cards).

Important: keep secret keys in environment variables only; do not commit them to source control.
