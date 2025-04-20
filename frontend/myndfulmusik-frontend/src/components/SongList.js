import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';

function SongList() {
  const [songs, setSongs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customFile, setCustomFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [spotifyResults, setSpotifyResults] = useState([]);

  const token = localStorage.getItem('accessToken');
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyAccessToken'));

  // Watch localStorage in case token is set after Spotify redirect
  useEffect(() => {
    const checkSpotifyToken = () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (token) setSpotifyToken(token);
    };

    checkSpotifyToken();
    window.addEventListener('storage', checkSpotifyToken);

    return () => {
      window.removeEventListener('storage', checkSpotifyToken);
    };
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/songs/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(response.data);
    } catch (error) {
      console.error("Fetch songs failed:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reviews/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Fetch reviews failed:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/comments/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(response.data);
    } catch (error) {
      console.error("Fetch comments failed:", error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchReviews();
    fetchComments();
  }, []);

  const refreshData = () => {
    fetchSongs();
    fetchReviews();
    fetchComments();
  };

  const handleCustomUpload = async (e) => {
    e.preventDefault();
    if (!customTitle || !customFile) return;

    const formData = new FormData();
    formData.append('customSongTitle', customTitle);
    formData.append('audioFile', customFile);

    try {
      await axios.post('http://127.0.0.1:8000/api/customsongs/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Custom song uploaded!');
      setCustomTitle('');
      setCustomFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert('Upload failed');
    }
  };

  const handleSpotifySearch = async (e) => {
    e.preventDefault();

    if (!spotifyToken) {
      alert("Please connect to Spotify first.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`
          }
        }
      );
      setSpotifyResults(response.data.tracks.items);
    } catch (error) {
      console.error("Spotify search error:", error);
      alert("Failed to search Spotify. Try reconnecting.");
    }
  };

  return (
    <div>
      <h2>Song List</h2>

      {!spotifyToken && (
        <div style={{ marginBottom: '1rem' }}>
          <a href="/connect">
            <button style={{ backgroundColor: '#1DB954', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px' }}>
              Connect with Spotify
            </button>
          </a>
        </div>
      )}

      {/* Spotify Search Bar */}
      <form onSubmit={handleSpotifySearch} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search Spotify songs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Display Spotify Search Results */}
      {spotifyResults.length > 0 && (
        <div>
          <h4>Spotify Results</h4>
          {spotifyResults.map(track => (
            <div key={track.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
              <img src={track.album.images[0]?.url} alt="Album Art" width="50" style={{ marginRight: '1rem' }} />
              <strong>{track.name}</strong> by {track.artists.map(a => a.name).join(', ')}

              {track.preview_url && (
                <div>
                  <audio controls src={track.preview_url}>Your browser does not support audio</audio>
                </div>
              )}

              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="300"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                title="Spotify Player"
              ></iframe>
            </div>
          ))}
        </div>
      )}

      {songs.map(song => (
        <div key={song.id} style={{ border: '1px solid #ddd', marginBottom: '2rem', padding: '1rem' }}>
          <h3>{song.title}</h3>
          <p><em>by {song.artist}</em></p>

          <ReviewForm songId={song.id} onReviewSubmitted={refreshData} />

          {reviews
            .filter(review => review.song === song.id)
            .map(review => (
              <div key={review.id} style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #ccc' }}>
                <p><strong>Rating:</strong> {review.rating}</p>
                <p>{review.review_text}</p>
                <CommentForm reviewId={review.id} onCommentSubmitted={refreshData} />
                <CommentThread
                  comments={comments.filter(c => c.review === review.id)}
                />
                <button
                  style={{ color: 'red', marginTop: '0.5rem' }}
                  onClick={async () => {
                    if (window.confirm("Delete this review?")) {
                      try {
                        await axios.delete(`http://127.0.0.1:8000/api/reviews/${review.id}/`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        refreshData();
                      } catch (err) {
                        alert("Failed to delete review");
                      }
                    }
                  }}
                >
                  Delete Review
                </button>
              </div>
            ))}
        </div>
      ))}

      <div style={{ marginTop: '3rem', borderTop: '2px solid #eee', paddingTop: '2rem' }}>
        <h3>Upload Your Custom Song</h3>
        <form onSubmit={handleCustomUpload}>
          <input
            type="text"
            placeholder="Custom Song Title"
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            required
          />
          <br />
          <input
            type="file"
            accept="audio/*"
            onChange={e => setCustomFile(e.target.files[0])}
            required
          />
          <br />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default SongList;
