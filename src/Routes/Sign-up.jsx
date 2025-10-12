import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const intendedPlan = location?.state?.intendedPlan;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const parts = fullName.trim().split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';

      await signup(email, password, { firstName, lastName });

      if (intendedPlan === 'premium') {
        navigate('/payment', { state: { plan: 'premium', priceId: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID } });
        return;
      }

      if (intendedPlan === 'free') {
        navigate('/');
        return;
      }

      navigate('/');
    } catch (err) {
      console.error('Signup error', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="SignUpPage">
      <div className="SignUp">
        <h2>Create a DEV@Deakin Account</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name*</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label>Email*</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
          </div>
          <div>
            <label>Password*</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" minLength={6} />
          </div>
          <div>
            <label>Confirm password*</label>
            <input type="password" />
          </div>

          <button type="submit" className="btn primary" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
