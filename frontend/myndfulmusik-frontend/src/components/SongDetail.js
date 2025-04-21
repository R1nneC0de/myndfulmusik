import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';

function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchSong();
    fetchReviews();
    fetchComments();
  }, [id]);

  const fetchSong = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/songs/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSong(response.data);
          
    } catch (err) {
      console.error("Error fetching song:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reviews/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data.filter(r => r.song === parseInt(id)));
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/comments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const refreshData = () => {
    fetchReviews();
    fetchComments();
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('accessToken');
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Review deleted');
      refreshData(); // <-- re-fetch reviews or navigate
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review");
    }
  };
  

  if (!song) return <p>Loading song details...</p>;

  return (
    <div style={{ backgroundColor: '#f5ebff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#6b21a8' }}>{song.title}</h1>
        <p><strong>🎤 Artist:</strong> {song.artist}</p>
        <p><strong>🎵 Album:</strong> {song.album}</p>
  
        <hr style={{ margin: '1.5rem 0', borderColor: '#ddd' }} />
  
        <h3 style={{ color: '#6b21a8' }}>✍️ Write a Review</h3>
        <ReviewForm songId={song.id} onReviewSubmitted={refreshData} />
  
        <h3 style={{ marginTop: '2rem', color: '#6b21a8' }}>🗒️ Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
  
        {reviews.map(review => (
          <div key={review.id} style={{
            marginTop: '1rem',
            background: '#faf5ff',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p>{review.review_text}</p>
  
            <CommentForm reviewId={review.id} onCommentSubmitted={refreshData} />
            <CommentThread comments={comments.filter(c => c.review === review.id)} />
  
            <button
              onClick={async () => {
                if (window.confirm("Delete this review?")) {
                  try {
                    await axios.delete(`http://127.0.0.1:8000/api/reviews/${review.id}/`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    refreshData();
                  } catch {
                    alert("Failed to delete review");
                  }
                }
              }}
              style={{ marginTop: '0.5rem', color: 'white', background: '#dc3545', border: 'none', padding: '6px 10px', borderRadius: '6px' }}
            >
              Delete Review
            </button>
          </div>
        ))}
  
        <button onClick={() => window.history.back()} style={{
          marginTop: '2rem',
          backgroundColor: '#6b21a8',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '6px'
        }}>
          ← Back to All Songs
        </button>
      </div>
    </div>
  );
  
  
}

export default SongDetail;
