import React from 'react';
import '../styles/info-pages.css';

export default function CodeOfConduct() {
  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <h1>Code of Conduct</h1>
        <p className="subtitle">Our commitment to a respectful and inclusive community</p>

        <section className="policy-section">
          <h2>1. Our Pledge</h2>
          <p>
            We are committed to providing a welcoming, safe, and inclusive environment for all members of the DEV@Deakin community, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Our Standards</h2>
          <h3>Expected Behavior</h3>
          <p>We expect all community members to:</p>
          <ul>
            <li>Be respectful and considerate in all interactions</li>
            <li>Use welcoming and inclusive language</li>
            <li>Accept constructive criticism gracefully</li>
            <li>Focus on what is best for the community</li>
            <li>Show empathy towards other community members</li>
            <li>Give credit to others' work and ideas</li>
            <li>Help newcomers feel welcome and supported</li>
            <li>Provide helpful, actionable feedback</li>
          </ul>

          <h3>Unacceptable Behavior</h3>
          <p>The following behaviors are unacceptable:</p>
          <ul>
            <li>Harassment, intimidation, or discrimination of any kind</li>
            <li>Offensive, insulting, or derogatory comments</li>
            <li>Personal or political attacks</li>
            <li>Public or private harassment</li>
            <li>Publishing others' private information without permission</li>
            <li>Trolling, insulting, or inflammatory comments</li>
            <li>Spam, advertising, or self-promotion</li>
            <li>Sexual language, imagery, or unwanted advances</li>
            <li>Encouraging or advocating for any of the above</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Community Guidelines</h2>
          
          <h3>Asking Questions</h3>
          <ul>
            <li>Search for existing answers before posting</li>
            <li>Provide clear, detailed descriptions of your problem</li>
            <li>Include relevant code snippets and error messages</li>
            <li>Show what you've tried and where you're stuck</li>
            <li>Accept that there may be multiple valid solutions</li>
          </ul>

          <h3>Answering Questions</h3>
          <ul>
            <li>Be patient with those still learning</li>
            <li>Explain the "why" behind your solutions</li>
            <li>Provide links to documentation and resources</li>
            <li>Avoid being condescending or dismissive</li>
            <li>Don't assume everyone has your level of experience</li>
          </ul>

          <h3>Posting Articles and Content</h3>
          <ul>
            <li>Ensure content is accurate and well-researched</li>
            <li>Cite sources and give proper attribution</li>
            <li>Use appropriate tags to help others find your content</li>
            <li>Respect intellectual property and copyright laws</li>
            <li>Provide context and clear explanations</li>
          </ul>

          <h3>Code Snippets and Examples</h3>
          <ul>
            <li>Test your code before sharing</li>
            <li>Format code properly for readability</li>
            <li>Add comments to explain complex logic</li>
            <li>Follow language-specific best practices</li>
            <li>Ensure examples are safe and don't include malicious code</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Enforcement</h2>
          
          <h3>Reporting</h3>
          <p>
            If you experience or witness unacceptable behavior, please report it through our <a href="/contact">Contact page</a>. All reports will be reviewed promptly and confidentially.
          </p>

          <h3>Consequences</h3>
          <p>Violations of this Code of Conduct may result in:</p>
          <ul>
            <li><strong>Warning:</strong> A private warning about the behavior</li>
            <li><strong>Temporary Suspension:</strong> Temporary loss of posting privileges</li>
            <li><strong>Permanent Ban:</strong> Permanent removal from the platform</li>
            <li><strong>Legal Action:</strong> In cases of illegal activity</li>
          </ul>

          <h3>Appeals</h3>
          <p>
            If you believe an enforcement action was made in error, you may appeal by contacting us at devdeakin@deakin.edu.au with details of your case.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Scope</h2>
          <p>
            This Code of Conduct applies to all DEV@Deakin spaces, including:
          </p>
          <ul>
            <li>Questions, articles, and comments</li>
            <li>Tutorial videos and their descriptions</li>
            <li>User profiles and personal journeys</li>
            <li>Private messages (if applicable)</li>
            <li>Related social media channels and events</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Diversity and Inclusion</h2>
          <p>
            We believe diverse perspectives strengthen our community. We actively encourage participation from people of all backgrounds and identities. We strive to create an environment where everyone can learn, share, and grow.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Academic Integrity</h2>
          <p>
            As a university-affiliated platform, we expect users to:
          </p>
          <ul>
            <li>Not post solutions to current assignments or assessments</li>
            <li>Provide guidance rather than complete solutions for homework</li>
            <li>Respect academic honesty policies</li>
            <li>Encourage learning and understanding, not just getting answers</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>8. Updates to this Code</h2>
          <p>
            We may update this Code of Conduct as our community evolves. Significant changes will be announced on the platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Acknowledgments</h2>
          <p>
            This Code of Conduct is adapted from the Contributor Covenant, version 2.0, and Stack Overflow's Code of Conduct, modified to fit the DEV@Deakin community.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. Contact</h2>
          <p>
            Questions about this Code of Conduct? Contact us at:
          </p>
          <p>
            <strong>Email:</strong> devdeakin@deakin.edu.au<br />
            <strong>Platform:</strong> Use the <a href="/contact">Contact Us</a> page
          </p>
        </section>

        <div className="info-page-footer conduct-footer">
          <p><strong>Thank you for helping make DEV@Deakin a welcoming, respectful community for all!</strong></p>
        </div>
      </div>
    </div>
  );
}
