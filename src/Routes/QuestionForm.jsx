import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../init-firebase";

function QuestionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const questionData = {
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "questions"), questionData);
      
      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      alert("Question posted successfully!");
      
    } catch (error) {
      console.error("Error posting question:", error);
      alert("Error posting question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <div className="form-inline">
        <label className="label">Title</label>
        <input
          type="text"
          placeholder="Start your question with how, what, why, etc."
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <p><b>Describe your problem</b></p>
      <textarea 
        className="textarea-field"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your problem in detail..."
      ></textarea>

      <div className="form-inline">
        <label className="label">Tags</label>
        <input
          type="text"
          placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
          className="input-field"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      
      <div className="button-container">
        <button 
          className="post-btn" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

export default QuestionForm;
