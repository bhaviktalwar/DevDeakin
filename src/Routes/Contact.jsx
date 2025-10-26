import React, { useState } from 'react';
import '../styles/info-pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSending(true);
    try {
      // Simulate sending (in production, this would call a backend endpoint or email service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="info-page-container">
      <div className="info-page-content contact-page">
        <h1>Contact Us</h1>
        <p className="subtitle">Get in touch with the DEV@Deakin team</p>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get Support</h2>
            <p>We're here to help! Whether you have questions, feedback, or need technical support, feel free to reach out.</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <h3>📧 Email</h3>
                <p>devdeakin@deakin.edu.au</p>
              </div>
              
              <div className="contact-method">
                <h3>🕐 Response Time</h3>
                <p>We typically respond within 24-48 hours on business days.</p>
              </div>
              
              <div className="contact-method">
                <h3>💬 Community Support</h3>
                <p>Post your question on the platform and get help from the community!</p>
              </div>
            </div>

            <div className="quick-links">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/faqs">Frequently Asked Questions</a></li>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            {success && (
              <div className="success-message">
                ✓ Your message has been sent successfully! We'll get back to you soon.
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button type="submit" className="submit-button" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
