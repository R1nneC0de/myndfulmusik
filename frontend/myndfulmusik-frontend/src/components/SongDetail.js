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

  if (!song) return <p>Loading song details...</p>;

  return (
    <div>
      <h2>{song.title}</h2>
      <p><strong>Artist:</strong> {song.artist}</p>
      <p><strong>Album:</strong> {song.album}</p>
  
      <ReviewForm songId={song.id} onReviewSubmitted={refreshData} />
  
      <h3>Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(review => (
        <div key={review.id} style={{ borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p>{review.review_text}</p>
          <CommentForm reviewId={review.id} onCommentSubmitted={refreshData} />
          <CommentThread comments={comments.filter(c => c.review === review.id)} />
        </div>
      ))}
  
      {/* ✅ Always show this button */}
      <button onClick={() => window.history.back()} style={{ marginTop: '2rem' }}>
        ← Back to All Songs
      </button>
    </div>
  );
  
}

export default SongDetail;
