import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';

function DemoCheckoutForm({ plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait.');
      return;
    }

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      const { error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) throw pmError;

      // Simulate server-side processing (demo only)
      await new Promise((r) => setTimeout(r, 900));

  // Mark success locally — in a real app you'd confirm payment on the server
  setSuccess(true);
  // Navigate to home after 5 seconds to let the user read the success message
  setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-success" style={{ maxWidth: 640, margin: '0 auto' }}>
        <h3>Payment successful</h3>
        <p>You are now subscribed to the <strong>{plan}</strong> plan.</p>
        <button className="btn primary" onClick={() => navigate('/')} style={{ marginTop: 12 }}>Continue</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
          <label>Card details</label>
        <div className="card-input">
          <CardElement options={{
            hidePostalCode: true,
            style: {
                base: { color: '#0f1720', fontSize: '16px', '::placeholder': { color: '#6b7280' } },
              invalid: { color: '#ff4d4f' }
            }
          }} />
        </div>
      </div>

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={loading} className="btn ghost">Cancel</button>
          <button type="submit" disabled={!stripe || loading} className="btn primary">{loading ? 'Processing…' : `Pay ${plan}`}</button>
      </div>
    </form>
  );
}

export default function Payment() {
  const location = useLocation();
  const planState = location.state || {};
  const plan = planState.plan || 'Premium';
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
  const { currentUser } = useAuth();

  // If publishable key is missing, show instructions (do not show card input)
  if (!publishableKey) {
    return (
      <div className="payment-page" style={{ padding: 24 }}>
        <div className="container">
          <h2>Payment</h2>
          <p className="muted">Plan: <strong>{plan}</strong></p>
          <div className="mt-8 card" style={{ borderColor: 'rgba(255,0,0,0.06)' }}>
            <p>Publishable key is not configured. To run locally, add your publishable key to <code>.env.local</code> as:</p>
            <pre style={{ background: '#111', color: '#fff', padding: 8 }}>{`REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...`}</pre>
            <p className="muted">After adding the file, restart the dev server (npm start).</p>
          </div>
        </div>
      </div>
    );
  }

  const stripePromise = loadStripe(publishableKey);

  return (
    <div className="payment-page" style={{ padding: 24 }}>
      <div className="container">
        <h2>Payment</h2>
        <p className="muted">Plan: <strong>{plan}</strong></p>

        <Elements stripe={stripePromise}>
          <div className="card mt-16 payment-card">
            <DemoCheckoutForm plan={plan} currentUser={currentUser} />
          </div>
        </Elements>
      </div>
    </div>
  );
}
