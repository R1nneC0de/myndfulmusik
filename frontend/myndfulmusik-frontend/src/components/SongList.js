import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { refreshSpotifyToken } from '../spotifyUtils';
import { refreshAccessToken } from '../authUtils';
import { Link } from 'react-router-dom';



function SongList() {
  const [spotifyResults, setSpotifyResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);

  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyAccessToken'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSaveSpotifySong = async (track) => {
    try {
      let token = localStorage.getItem('accessToken');
      const songData = {
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        genre: "Unknown",
        release_date: track.album.release_date || "2000-01-01",
        length: Math.round(track.duration_ms / 1000),
      };
  
      let response;
      try {
        response = await axios.post('http://127.0.0.1:8000/api/songs/', songData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // 🔁 If token is expired, refresh and retry
        if (error.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            response = await axios.post('http://127.0.0.1:8000/api/songs/', songData, {
              headers: { Authorization: `Bearer ${newToken}` }
            });
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
  
      const songId = response.data.id;
      navigate(`/songs/${songId}`);
    } catch (error) {
      if (error.response?.data?.id) {
        navigate(`/songs/${error.response.data.id}`);
      } else {
        console.error("Save failed", error);
        alert("Something went wrong while saving the song.");
      }
    }
  };
  
  
  
  const fetchTrendingSpotifySongs = async () => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=10`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`
          }
        }
      );
      const tracks = response.data.items.map(item => item.track);
      setSpotifyResults(tracks);
    } catch (error) {
      console.warn("Trending songs could not be loaded. Possibly due to invalid token or playlist.");
setSpotifyResults([]); // fallback to empty list

    }
  };
  
  
  

  useEffect(() => {
    const checkSpotifyToken = () => {
      const token = localStorage.getItem('spotifyAccessToken');
      if (token) setSpotifyToken(token);
    };

    checkSpotifyToken();
    window.addEventListener('storage', checkSpotifyToken);

    if (spotifyToken) fetchTrendingSpotifySongs();

    return () => {
      window.removeEventListener('storage', checkSpotifyToken);
    };
  }, [spotifyToken]);

  const handleSpotifySearch = async (e) => {
    e.preventDefault();

    let tokenToUse = spotifyToken;

    if (!tokenToUse) {
      alert("Please connect to Spotify first.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );
      setSpotifyResults(response.data.tracks.items);
    } catch (error) {
      console.error("Spotify search error:", error);

      if (error.response?.status === 401 && localStorage.getItem('spotifyRefreshToken')) {
        try {
          const newToken = await refreshSpotifyToken();
          if (newToken) {
            tokenToUse = newToken;
            const retryResponse = await axios.get(
              `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=5`,
              {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              }
            );
            setSpotifyResults(retryResponse.data.tracks.items);
            return;
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          alert("Spotify session expired. Please reconnect.");
        }
      }

      alert("Failed to search Spotify. Try reconnecting.");
    }
  };

  return (
    <div style={{ backgroundColor: '#f5ebff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#6b21a8' }}>🎶 MYndfulMusiK</h2>
        <div>
          <button
            onClick={() => navigate('/profile')}
            style={{ marginRight: '10px', backgroundColor: '#6b21a8', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' }}
          >
            👤 My Profile
          </button>
          <button
            onClick={() => navigate('/custom-upload')}
            style={{ marginRight: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' }}
          >
            ➕ Upload a Custom Song
          </button>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px' }}
          >
            Logout
          </button>
        </div>
      </div>
  
      {!spotifyToken && (
        <div style={{ marginBottom: '1rem' }}>
          <a href="/connect">
            <button style={{
              backgroundColor: '#1DB954',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px'
            }}>
              Connect with Spotify
            </button>
          </a>
        </div>
      )}
  
      <form onSubmit={handleSpotifySearch} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search Spotify songs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: '6px', width: '250px', marginRight: '8px' }}
        />
        <button type="submit" style={{
          backgroundColor: '#6b21a8',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px'
        }}>
          Search
        </button>
      </form>
  
      {spotifyResults.length > 0 && (
        <div>
          <h4 style={{ color: '#6b21a8' }}>🎧 Spotify Songs</h4>
          {spotifyResults.map(track => (
            <div key={track.id} style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              border: '1px solid #d8b4fe',
              backgroundColor: '#f3e8ff',
              borderRadius: '8px'
            }}>
              <img src={track.album.images[0]?.url} alt="Album Art" width="50" style={{ marginRight: '1rem' }} />
              <strong>{track.name}</strong> by {track.artists.map(a => a.name).join(', ')}
              <br />
  
              <button
                onClick={() => handleSaveSpotifySong(track)}
                style={{
                  marginTop: '0.5rem',
                  background: '#10b981',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Review This Song
              </button>
  
              {track.preview_url && (
                <div style={{ marginTop: '0.5rem' }}>
                  <audio controls src={track.preview_url}>
                    Your browser does not support audio
                  </audio>
                </div>
              )}
  
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="300"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                title="Spotify Player"
                style={{ marginTop: '0.5rem' }}
              ></iframe>
            </div>
          ))}
        </div>
      )}
  
      {spotifyResults.length === 0 && (
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#ede9fe',
          borderRadius: '12px',
          color: '#6b21a8'
        }}>
          <h3>🎵 All Songs</h3>
          <p>No songs available yet.</p>
          <p>Use the search bar above to find and review songs from Spotify!</p>
        </div>
      )}
    </div>
  );
  
  
}

export default SongList;
