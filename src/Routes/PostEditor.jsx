import React from 'react';
import PostEditorComponent from './PostEditorComponent.jsx';

const PostEditorRoute = () => {
  return (
    <div className="create-post-wrapper">
      <h1>Create a Post</h1>
      <PostEditorComponent />
    </div>
  );
};

export default PostEditorRoute;
