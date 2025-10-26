import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/info-pages.css';

export default function Help() {
  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <h1>Help Center</h1>
        <p className="subtitle">Get help with using DEV@Deakin platform</p>

        <section className="help-section">
          <h2>Getting Started</h2>
          <div className="help-card">
            <h3>Create an Account</h3>
            <p>Sign up with your email or use Google sign-in to get started. Once registered, you can post questions, write articles, and engage with the community.</p>
          </div>
          <div className="help-card">
            <h3>Navigate the Platform</h3>
            <p>Use the navigation bar to access different sections: Home, Articles, Tutorials, Messages (AI Chat), and your Personal Journey.</p>
          </div>
        </section>

        <section className="help-section">
          <h2>Posting Content</h2>
          <div className="help-card">
            <h3>Ask a Question</h3>
            <p>Click on 'Questions' in the footer or use the Post Editor. Select 'Question' as the post type, provide a clear title, detailed description, and relevant tags to help others find and answer your question.</p>
          </div>
          <div className="help-card">
            <h3>Write an Article</h3>
            <p>Use the Post Editor and select 'Article'. You can include code snippets in multiple languages (JavaScript, Python, C++, etc.) and write your content in Markdown. See a live preview as you write.</p>
          </div>
          <div className="help-card">
            <h3>Upload Tutorial Videos</h3>
            <p>On the home page, scroll to the Tutorial Videos section. Upload small video files (under 900KB) with a title and description. You can also add sample videos to get started.</p>
          </div>
        </section>

        <section className="help-section">
          <h2>Features</h2>
          <div className="help-card">
            <h3>AI Chat Assistant</h3>
            <p>Access the Messages page to chat with an AI assistant. Ask programming questions, get code help, or learn new concepts. AI conversations are private and ephemeral.</p>
          </div>
          <div className="help-card">
            <h3>Personal Journey</h3>
            <p>Track your learning progress by adding milestones to your Personal Journey. Record important achievements, completed projects, and learning goals with dates.</p>
          </div>
          <div className="help-card">
            <h3>Rate and View Content</h3>
            <p>Rate tutorial videos and articles to help others find quality content. View counts and ratings show community engagement.</p>
          </div>
        </section>

        <section className="help-section">
          <h2>Account & Settings</h2>
          <div className="help-card">
            <h3>Sign In with Google</h3>
            <p>Use your Google account for quick and secure authentication. Click 'Sign in with Google' on the login page.</p>
          </div>
          <div className="help-card">
            <h3>Manage Your Content</h3>
            <p>You can delete your own questions, articles, videos, and journey milestones. Look for the delete option when viewing your content while signed in.</p>
          </div>
        </section>

        <section className="help-section">
          <h2>Troubleshooting</h2>
          <div className="help-card">
            <h3>Can't Sign In</h3>
            <p>Ensure you're using the correct email and password. For Google sign-in issues, check that third-party cookies are enabled in your browser.</p>
          </div>
          <div className="help-card">
            <h3>Video Upload Fails</h3>
            <p>Videos must be under 900KB due to storage limitations. Try compressing your video or using a shorter clip. Only video formats are accepted.</p>
          </div>
          <div className="help-card">
            <h3>AI Chat Not Working</h3>
            <p>This may indicate a configuration issue with the API. Try refreshing the page, and if the problem persists, contact support.</p>
          </div>
        </section>

        <div className="info-page-footer">
          <p>Need more help? Check our <Link to="/faqs">FAQs</Link> or <Link to="/contact">contact us</Link> directly.</p>
        </div>
      </div>
    </div>
  );
}
