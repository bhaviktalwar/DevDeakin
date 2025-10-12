// export default PostEditor;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../init-firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

// ✅ Modern CodeMirror imports
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
// python extension is loaded dynamically to avoid build-time failure when @lezer/python isn't present
import { githubDark } from "@uiw/codemirror-theme-github";

import "../postEditor.css";

const PostEditorComponent = () => {
  const codeTemplates = {
    javascript: `// JavaScript
console.log('Hello, world!');`,
    react: `// React (JSX)
import React from 'react';

function App() {
  return <h1>Hello, React!</h1>;
}

export default App;`,
    python: `# Python
print('Hello, world!')`,
    cpp: `// C++
#include <iostream>
using namespace std;

int main() {
  cout << "Hello, world!" << endl;
  return 0;
}`,
    csharp: `// C#
using System;

class Program {
  static void Main() {
    Console.WriteLine("Hello, world!");
  }
}`,
    html: `<!-- HTML -->
<!doctype html>
<html>
  <head><title>Hello</title></head>
  <body><h1>Hello, world!</h1></body>
</html>`,
    css: `/* CSS */
body { font-family: Arial, sans-serif; }`,
  };

  const languageToExtension = {
    javascript,
    react: javascript,
    cpp,
    csharp: cpp,
    html,
    css,
  };

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates.javascript);
  const [markdown, setMarkdown] = useState("# Post Title\n\nStart writing your post here...");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const navigate = useNavigate();
  const [pythonExtension, setPythonExtension] = useState(null);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(codeTemplates[lang] || "");

    if (lang === 'python') {
      // dynamic import to avoid bundler resolving @lezer/python at build time
      import('@codemirror/lang-python')
        .then((mod) => {
          // store factory so we can call it when rendering
          setPythonExtension(() => mod.python);
        })
        .catch((err) => {
          console.warn('Could not load python extension dynamically:', err);
          setPythonExtension(() => null);
        });
    }
  };

  const handlePost = async () => {
    setPostError("");
    if (!markdown.trim()) {
      setPostError("Please enter post content before posting.");
      return;
    }

    setPosting(true);
    try {
      let title = (markdown.split("\n")[0] || "").replace(/^#\s*/, "").trim();
      if (!title) title = "Untitled Post";

      const postDoc = {
        title,
        content: markdown,
        code,
        language,
        authorId: auth?.currentUser?.uid || null,
        authorName: auth?.currentUser?.email || "Anonymous",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), postDoc);
      alert("✅ Post successfully saved to Firebase!");
      navigate("/");
    } catch (err) {
      console.error("Error saving post:", err);
      setPostError(err.message || "Failed to save post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="editor-card">
      <div className="editor-column">
        <div className="editor-header">
          <h2>Create a Post</h2>
          <div className="editor-controls">
            <label>Language:</label>
            <select
              className="select-language"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="react">React (JSX)</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
            <button className="post-button" onClick={handlePost} disabled={posting}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        <div className="code-block">
          <CodeMirror
            value={code}
            height="300px"
            theme={githubDark}
            extensions={[(() => {
              if (language === 'python') {
                return pythonExtension ? pythonExtension() : javascript();
              }
              const extFactory = languageToExtension[language];
              return extFactory ? extFactory() : javascript();
            })()]}
            onChange={(value) => setCode(value)}
          />
        </div>

        <h3>Markdown</h3>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="markdown-input"
        />
        {postError && <div className="post-error">{postError}</div>}
      </div>

      <div className="preview-column">
        <h3>Markdown Preview</h3>
        <div className="markdown-preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>

        <h3>Code Preview</h3>
        <pre className="code-preview">{code}</pre>
      </div>
    </div>
  );
};

export default PostEditorComponent;
