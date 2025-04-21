import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios
        .get(`http://127.0.0.1:8000/api/spotify/callback/?code=${code}`)
        .then((res) => {
          const spotifyToken = res.data.access_token;
          const refreshToken = res.data.refresh_token;

          if (spotifyToken) {
            localStorage.setItem('spotifyAccessToken', spotifyToken);
            if (refreshToken) {
              localStorage.setItem('spotifyRefreshToken', refreshToken);
            }
            alert('Spotify connected successfully! ✅');
          } else {
            alert('Spotify login failed: No token returned.');
          }

          // If already logged in to the app, go to home
          if (localStorage.getItem('accessToken')) {
            navigate('/');
          } else {
            navigate('/');
          }
        })
        .catch((err) => {
          console.error('Spotify auth failed:', err);
          alert('Spotify login failed.');
          navigate('/');
        });
    }
  }, [navigate]);

  return <p>Connecting to Spotify...</p>;
}

export default Callback;
