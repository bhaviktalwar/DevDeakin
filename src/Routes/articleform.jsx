import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../init-firebase";

function ArticleForm() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [articleText, setArticleText] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      alert("Image too large! Select an image under 800KB.");
      return;
    }

    setImage(file);
    setImageUploaded(false);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    try {
      setLoading(true);
  await convertToBase64(image);
  setImageUploaded(true);
      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Error uploading image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!title.trim() || !abstract.trim() || !articleText.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (image && !imageUploaded) {
      alert("Please upload the selected image first!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (image && imageUploaded) {
        imageUrl = await convertToBase64(image);
      }

      const articleData = {
        title: title.trim(),
        abstract: abstract.trim(),
        articleText: articleText.trim(),
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        imageUrl,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "articles"), articleData);

      // Reset form
      setTitle("");
      setAbstract("");
      setArticleText("");
      setTags("");
      setImage(null);
      setImagePreview(null);
      setImageUploaded(false);

      alert("Article posted successfully!");
    } catch (error) {
      console.error("Error posting article:", error);
      alert("Error posting article: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <div className="form-inline">
        <label className="label">Add an Image:</label>
        <div className="file-upload-container">
          <div className="file-input">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="file-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="browse-btn">
              Browse
            </label>
            <span className="file-name">
              {image ? image.name : "No file chosen"}
            </span>
          </div>
          <button 
            type="button"
            onClick={handleImageUpload}
            disabled={imageUploaded || loading}
            className="upload-btn"
          >
            {loading ? "Uploading..." : imageUploaded ? "Uploaded " : "Upload"}
          </button>
        </div>
      </div>

      {imagePreview && (
        <div className="image-preview">
          <p><b>Image Preview:</b></p>
          <img src={imagePreview} alt="Preview" className="preview-image" />
          {imageUploaded && <p style={{color: 'green'}}> Image uploaded successfully!</p>}
        </div>
      )}

      <div className="form-inline">
        <label className="label">Title</label>
        <input
          type="text"
          placeholder="Enter a descriptive title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <p><b>Abstract</b></p>
      <textarea
        placeholder="Enter a 1-paragraph abstract"
        className="textarea-field"
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
      ></textarea>

      <p><b>Article Text</b></p>
      <textarea
        placeholder="Enter full article text"
        className="textarea-field"
        value={articleText}
        onChange={(e) => setArticleText(e.target.value)}
      ></textarea>

      <div className="form-inline">
        <label className="label">Tags</label>
        <input
          type="text"
          placeholder="Add up to 3 tags (comma separated)"
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

export default ArticleForm;