// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [reviews, setReviews] = useState([]);
  const [customSongs, setCustomSongs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchUserReviews();
    fetchCustomSongs();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reviews/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = JSON.parse(atob(token.split('.')[1])).user_id;
      setReviews(response.data.filter(review => review.user.id === userId));
    } catch (err) {
      console.error('Failed to load user reviews:', err);
    }
  };

  const fetchCustomSongs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customsongs/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = JSON.parse(atob(token.split('.')[1])).user_id;
      setCustomSongs(response.data.filter(song => song.user_id === userId));
    } catch (err) {
      console.error('Failed to load custom songs:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f3e8ff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#6b21a8' }}>🙋 Your Profile</h2>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#7c3aed', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px' }}>Home</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#7c3aed' }}>📝 Your Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} style={{ marginTop: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
              <strong>{review.song_title || 'Unknown Song'}</strong>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p>{review.review_text}</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(review.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ color: '#7c3aed' }}>🎧 Your Custom Songs</h3>
        {customSongs.length === 0 ? (
          <p>No custom songs uploaded yet.</p>
        ) : (
          customSongs.map((song, idx) => (
            <div key={idx} style={{ marginTop: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
              <strong>{song.customsongtitle}</strong>
              <p>Uploaded on: {new Date(song.uploaddate).toLocaleDateString()}</p>
              <audio controls src={`http://127.0.0.1:8000/${song.audiofilepath}`} style={{ width: '100%' }}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
