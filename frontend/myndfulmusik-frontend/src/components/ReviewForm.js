import React, { useState } from 'react';
import axios from 'axios';

function ReviewForm({ songId, onReviewSubmitted }) {
  const [rating, setRating] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://127.0.0.1:8000/api/reviews/', {
        song: songId,
        rating: parseInt(rating),
        review_text: text,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setRating('');
      setText('');
      onReviewSubmitted(); // Trigger refresh
    } catch (err) {
      console.error(err.response?.data);
      setError('Failed to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Write a Review</h4>
      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={e => setRating(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Your review..."
        value={text}
        onChange={e => setText(e.target.value)}
        required
      />
      <br />
      <button type="submit">Submit Review</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}

export default ReviewForm;
