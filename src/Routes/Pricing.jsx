// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export default function Pricing() {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();

//   const handleChoosePremium = () => {
//     if (!currentUser) {
//       // Redirect to signup/login first, pass intended plan so user returns to payment
//       navigate('/signup', { state: { intendedPlan: 'premium' } });
//       return;
//     }

//     // Navigate to /payment and pass plan info
//     navigate('/payment', { state: { plan: 'premium', priceId: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID } });
//   };

//   const handleChooseFree = () => {
//     if (!currentUser) {
//       navigate('/signup', { state: { intendedPlan: 'free' } });
//       return;
//     }

//     // For free plan, update user record or simply acknowledge
//     window.alert('You selected the Free plan. Enjoy the basic features.');
//     navigate('/');
//   };

//   return (
//     <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
//       <h2>DEV@Deakin — Plans</h2>
//       <p>Choose a plan that suits you. Premium unlocks advanced features and support.</p>

//       <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
//         <div style={{ flex: 1, border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
//           <h3>Free</h3>
//           <p><strong>$0</strong> — Basic features</p>
//           <ul>
//             <li>Post content</li>
//             <li>Basic themes</li>
//             <li>Community support</li>
//           </ul>
//           <button onClick={handleChooseFree}>Choose Free</button>
//         </div>

//         <div style={{ flex: 1, border: '1px solid #f1c40f', padding: 20, borderRadius: 8, background: '#fffbe6' }}>
//           <h3>Premium</h3>
//           <p><strong>$5 / month</strong> — Pro features</p>
//           <ul>
//             <li>Custom messages & banners</li>
//             <li>Advanced themes & customization</li>
//             <li>Admin analytics dashboard</li>
//             <li>Priority support</li>
//           </ul>
//           <button onClick={handleChoosePremium}>Choose Premium</button>
//         </div>
//       </div>
//     </div>
//   );
// }
