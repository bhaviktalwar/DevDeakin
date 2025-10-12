import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QFwTkLcmjWVTFsVFIt1ppsin4TqWRiNdk0r7Rk4vJTqPiC2Mt9YuJ8NfRpq401L7gRteG4Mpzo4lCV8BNS6nrNS00AovPbipI')}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Elements>
    </BrowserRouter>
);

reportWebVitals();
