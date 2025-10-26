import React from 'react';
import '../styles/info-pages.css';

export default function Privacy() {
  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <h1>Privacy Policy</h1>
        <p className="subtitle">Last updated: October 25, 2025</p>

        <section className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            DEV@Deakin ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>When you register for an account, we collect:</p>
          <ul>
            <li>Name and email address</li>
            <li>Authentication credentials (encrypted passwords or OAuth tokens)</li>
            <li>Profile information you choose to provide</li>
          </ul>

          <h3>Content You Create</h3>
          <ul>
            <li>Questions, articles, and tutorial videos you post</li>
            <li>Comments, ratings, and interactions with other users' content</li>
            <li>Personal journey milestones and achievements</li>
            <li>Messages and AI chat conversations (ephemeral, not stored)</li>
          </ul>

          <h3>Usage Information</h3>
          <ul>
            <li>Device information (browser type, operating system)</li>
            <li>Log data (IP address, access times, pages viewed)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Display your contributions (posts, questions, videos) to the community</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you technical notices, updates, and security alerts</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Prevent fraud and enforce our Terms of Service</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share information:</p>
          <ul>
            <li><strong>Publicly:</strong> Content you post (questions, articles, videos) is publicly visible</li>
            <li><strong>With Service Providers:</strong> Firebase (authentication, database), OpenAI (AI chat), Stripe (payments)</li>
            <li><strong>For Legal Reasons:</strong> When required by law or to protect rights and safety</li>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information, including:
          </p>
          <ul>
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Secure authentication through Firebase</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and monitoring</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your account information</li>
            <li>Delete your posts, questions, and uploaded content</li>
            <li>Opt out of promotional communications</li>
            <li>Request a copy of your data</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies through your browser settings, but disabling them may affect functionality.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Third-Party Services</h2>
          <p>Our platform integrates with:</p>
          <ul>
            <li><strong>Firebase:</strong> Authentication and data storage (Google's Privacy Policy applies)</li>
            <li><strong>OpenAI:</strong> AI chat functionality (OpenAI's Privacy Policy applies)</li>
            <li><strong>Stripe:</strong> Payment processing (Stripe's Privacy Policy applies)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our service is intended for users 13 years and older. We do not knowingly collect information from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated "Last updated" date.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> devdeakin@deakin.edu.au<br />
            <strong>Address:</strong> Deakin University, Victoria, Australia
          </p>
        </section>
      </div>
    </div>
  );
}
