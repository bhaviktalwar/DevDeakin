import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Plan() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChoosePremium = () => {
    if (!currentUser) {
      // Redirect to signup/login first, pass intended plan so user returns to payment
      navigate('/signup', { state: { intendedPlan: 'premium' } });
      return;
    }

    // Navigate to /payment and pass plan info
    navigate('/payment', { state: { plan: 'premium', priceId: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID } });
  };

  const handleChooseFree = () => {
    if (!currentUser) {
      navigate('/signup', { state: { intendedPlan: 'free' } });
      return;
    }

    // For free plan, update user record or simply acknowledge
    window.alert('You selected the Free plan. Enjoy the basic features.');
    navigate('/');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 160px)', padding: 24 }}>
      <div className="container center mb-24">
        <h2>DEV@Deakin — Plans</h2>
        <p>Choose a plan that suits you. Premium unlocks advanced features and support.</p>
      </div>

      <div className="container">
        <div className="pricing-grid">
          <div className="card">
            <h3>Free</h3>
            <p><strong>$0</strong> — Basic features</p>
            <ul>
              <li>Post content</li>
              <li>Basic themes</li>
              <li>Community support</li>
            </ul>
            <div className="mt-16">
              <button className="btn ghost" onClick={handleChooseFree}>Choose Free</button>
            </div>
          </div>

          <div className="card alt premium-card">
            <h3 className="premium-title">Premium</h3>
            <p className="premium-price"><strong>$5 / month</strong></p>
            <div className="premium-features">
              <ul>
                <li>Custom messages & banners</li>
                <li>Advanced themes & customization</li>
                <li>Admin analytics dashboard</li>
                <li>Priority support</li>
              </ul>
            </div>
            <div className="mt-16">
              <button className="btn primary" onClick={handleChoosePremium}>Choose Premium</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
