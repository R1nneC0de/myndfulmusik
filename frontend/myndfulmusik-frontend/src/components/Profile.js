import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [userReviews, setUserReviews] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reviews/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentUserId = JSON.parse(atob(token.split('.')[1])).user_id;

      const filteredReviews = response.data.filter(r => r.user.id === currentUserId);
      setUserReviews(filteredReviews);
    } catch (err) {
      console.error('Failed to load user reviews:', err);
    }
  };

  return (
    <div>
      <h2>🧑‍🎤 Your Reviews</h2>
      {userReviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        userReviews.map(review => (
          <div key={review.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
            <h3>{review.song_title || 'Unknown Song'}</h3>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p>{review.review_text}</p>
            <small>🕒 {new Date(review.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;
