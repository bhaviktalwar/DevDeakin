import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { safeSendEmailVerification } from '../init-firebase';
import '../styles/verify-email.css';

export default function VerifyEmail() {
  const { currentUser, logout, refreshCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const handleResend = async () => {
    if (!currentUser) return;
    setBusy(true);
    setStatus('');
    try {
      const res = await safeSendEmailVerification(currentUser, 60);
      if (res.ok) {
        setStatus('Verification email sent again. Please check your inbox and spam folder.');
      } else if (res.reason === 'rate-limited' || res.reason === 'too-many-requests') {
        const seconds = res.retryAfter ?? 60;
        setStatus(`Please wait ${seconds}s before requesting another verification email.`);
      } else {
        setStatus(res.message || 'Failed to resend verification email.');
      }
    } catch (e) {
      setStatus(e?.message || 'Failed to resend verification email.');
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentUser) return;
    setBusy(true);
    setStatus('');
    try {
      const isVerified = await refreshCurrentUser();
      if (isVerified) {
        alert('Email verified! Sign up complete.');
        navigate('/');
      } else {
        setStatus('Not verified yet. Please click the link in your email, then press Refresh.');
      }
    } catch (e) {
      setStatus(e?.message || 'Could not check verification status.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="verify-email-container">
      <h2 className="ve-title">Verify your email</h2>
      <p className="ve-desc">We sent a verification link to your email address.</p>
      <ol className="verify-email-steps">
        <li>Open your inbox and click the verification link.</li>
        <li>Return to this page and press Refresh.</li>
      </ol>
      {status && <div className="verify-email-status">{status}</div>}
      <div className="verify-email-actions">
        <button className="btn btn-secondary" onClick={handleResend} disabled={busy}>Resend email</button>
        <button className="btn btn-primary" onClick={handleRefresh} disabled={busy}>Refresh</button>
        <button className="btn btn-ghost push-right" onClick={() => { logout(); navigate('/'); }}>Log out</button>
      </div>
    </div>
  );
}
