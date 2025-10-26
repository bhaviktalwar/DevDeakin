import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/info-pages.css';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is DEV@Deakin?",
      answer: "DEV@Deakin is a collaborative platform for developers at Deakin University to share knowledge, ask questions, post articles, and learn together. It's designed to foster a vibrant developer community within the university."
    },
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the navigation bar, fill in your details including email and password, and you'll be able to start posting questions, articles, and engaging with the community."
    },
    {
      question: "Can I post both questions and articles?",
      answer: "Yes! Use the Post Editor (accessible from the navigation or footer) and select either 'Question' or 'Article' from the post type dropdown. Questions are for seeking help, while articles are for sharing knowledge and tutorials."
    },
    {
      question: "How do I sign in with Google?",
      answer: "On the login page, click the 'Sign in with Google' button. You'll be redirected to Google's authentication page. Make sure your domain is authorized in Firebase settings for this to work."
    },
    {
      question: "What are tutorial videos and how do I upload them?",
      answer: "Tutorial videos are short educational clips you can share with the community. On the home page, scroll to the 'Tutorial Videos' section. You can upload small video files (under ~900KB) directly, or use the sample videos feature to get started."
    },
    {
      question: "How does the AI chat feature work?",
      answer: "Navigate to the Messages page to access AI chat. You can ask programming questions and get instant AI-powered responses. Note: AI conversations are ephemeral and won't appear in your conversation history."
    },
    {
      question: "What is the Personal Journey feature?",
      answer: "Personal Journey lets you track your learning milestones and development progress. Add important dates, achievements, and goals to create a timeline of your developer journey."
    },
    {
      question: "Can I delete my posts?",
      answer: "Yes, you can delete your own posts, questions, videos, and journey milestones. Look for the 'Delete' button on items you've created while signed in."
    },
    {
      question: "Why am I seeing 'AI is unavailable'?",
      answer: "This typically happens when the OpenAI API key isn't configured in the environment variables, or if there's a network issue. Contact the site administrator if the problem persists."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Please contact us through the Contact Us page with details about the content in question. Our moderation team will review it promptly."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <h1>Frequently Asked Questions</h1>
        <p className="subtitle">Find answers to common questions about DEV@Deakin</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="info-page-footer">
          <p>Still have questions? <Link to="/contact">Contact us</Link> or visit our <Link to="/help">Help Center</Link>.</p>
        </div>
      </div>
    </div>
  );
}
