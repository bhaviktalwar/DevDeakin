import React from 'react';
import '../styles/info-pages.css';

export default function Terms() {
  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <h1>Terms of Service</h1>
        <p className="subtitle">Last updated: October 25, 2025</p>

        <section className="policy-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using DEV@Deakin ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Description of Service</h2>
          <p>
            DEV@Deakin is an online community platform for developers at Deakin University. The Platform allows users to:
          </p>
          <ul>
            <li>Post questions and receive answers from the community</li>
            <li>Share articles, tutorials, and code snippets</li>
            <li>Upload and view tutorial videos</li>
            <li>Interact with an AI chat assistant</li>
            <li>Track personal learning journeys</li>
            <li>Rate and engage with community content</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. User Accounts</h2>
          <h3>Registration</h3>
          <p>
            You must create an account to access certain features. You agree to provide accurate, current information and maintain the security of your account credentials.
          </p>
          <h3>Account Responsibilities</h3>
          <ul>
            <li>You are responsible for all activities under your account</li>
            <li>You must not share your account credentials</li>
            <li>You must notify us immediately of any unauthorized access</li>
            <li>You must be at least 13 years old to create an account</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. User Content</h2>
          <h3>Your Responsibilities</h3>
          <p>You are solely responsible for content you post. You agree not to post content that:</p>
          <ul>
            <li>Violates any laws or regulations</li>
            <li>Infringes intellectual property rights of others</li>
            <li>Contains malware, viruses, or malicious code</li>
            <li>Is harmful, threatening, abusive, or harassing</li>
            <li>Contains spam, advertising, or promotional materials</li>
            <li>Impersonates any person or entity</li>
            <li>Is pornographic, obscene, or offensive</li>
          </ul>

          <h3>Content License</h3>
          <p>
            By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content on the Platform.
          </p>

          <h3>Content Moderation</h3>
          <p>
            We reserve the right to remove any content that violates these terms or is otherwise objectionable, without notice.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Platform for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to systems or data</li>
            <li>Interfere with or disrupt the Platform's operation</li>
            <li>Collect user information without consent</li>
            <li>Use automated tools (bots, scrapers) without permission</li>
            <li>Reverse engineer or decompile any part of the Platform</li>
            <li>Create multiple accounts to manipulate ratings or votes</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Intellectual Property</h2>
          <p>
            The Platform, including its design, code, graphics, and content (excluding user-generated content), is owned by Deakin University and protected by intellectual property laws.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Third-Party Services</h2>
          <p>
            The Platform integrates third-party services (Firebase, OpenAI, Stripe). Your use of these services is subject to their respective terms and privacy policies.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Disclaimers and Limitations</h2>
          <h3>No Warranties</h3>
          <p>
            The Platform is provided "as is" without warranties of any kind, express or implied. We do not guarantee:
          </p>
          <ul>
            <li>Uninterrupted or error-free operation</li>
            <li>Accuracy or reliability of content</li>
            <li>That the Platform will meet your requirements</li>
          </ul>

          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Termination</h2>
          <p>
            We may suspend or terminate your account at any time, with or without notice, for violations of these terms or any other reason. You may delete your account at any time.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Deakin University and DEV@Deakin from any claims, damages, or expenses arising from your use of the Platform or violation of these terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Victoria, Australia. Any disputes shall be resolved in the courts of Victoria.
          </p>
        </section>

        <section className="policy-section">
          <h2>13. Contact</h2>
          <p>
            For questions about these Terms, contact us at:
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
