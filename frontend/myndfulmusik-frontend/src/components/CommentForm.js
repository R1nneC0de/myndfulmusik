import React, { useState } from 'react';
import axios from 'axios';

function CommentForm({ reviewId, onCommentSubmitted }) {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/comments/',
        {
          review: reviewId,
          comment_text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentText('');
      setError('');
      onCommentSubmitted && onCommentSubmitted();
    } catch (err) {
      console.error(err.response?.data);
      setError('Failed to submit comment.');
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <textarea
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />
      <br />
      <button type="submit">Submit Comment</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default CommentForm;
