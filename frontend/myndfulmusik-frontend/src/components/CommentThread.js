import React, { useState } from 'react';
import axios from 'axios';

function CommentThread({ reviewId }) {
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/comments/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const filtered = response.data.filter(c => c.review === reviewId);
      setComments(filtered);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
    setLoading(false);
  };

  const toggleComments = () => {
    if (!expanded) fetchComments();
    setExpanded(!expanded);
  };

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button onClick={toggleComments}>
        {expanded ? 'Hide Comments' : 'View Comments'}
      </button>

      {expanded && (
        loading ? <p>Loading comments...</p> :
        <ul>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map(comment => (
              <li key={comment.id}>
                <strong>{comment.user.username}</strong>: {comment.comment_text}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default CommentThread;
