import React, { useState } from "react";
import "../styles/PostPage.css";
import QuestionForm from "./QuestionForm.jsx";
import ArticleForm from "./articleform.jsx";

function PostPage() {
  const [postType, setPostType] = useState("question");

  return (
    <div className="post-container">
      <div className="section-heading">
        <h2>New Post</h2>
      </div>

      <div className="form-inline">
        <label className="label">Select Post Type:</label>
        <div className="inline-inputs">
          <label>
            <input 
              type="radio"
              name="postType"
              value="question"
              checked={postType === "question"}
              onChange={() => setPostType("question")}
              style={{ accentColor: "black" }}
            />
            Question
          </label>
          <label>
            <input
              type="radio"
              name="postType"
              value="article"
              checked={postType === "article"}
              onChange={() => setPostType("article")}
              style={{ accentColor: "black" }}
            />
            Article
          </label>
        </div>
      </div><br />

      <div className="section-heading">
        <strong>What do you want to ask or share</strong>
      </div>

      {postType === "question" ? <QuestionForm /> : <ArticleForm />}
    </div>
  );
}

export default PostPage;