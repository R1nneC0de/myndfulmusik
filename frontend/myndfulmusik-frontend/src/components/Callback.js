import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Callback({ onSpotifySuccess }) {
    const navigate = useNavigate();
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
  
      if (code) {
        axios.get(`http://127.0.0.1:8000/api/spotify/callback/?code=${code}`)
          .then(res => {
            const spotifyToken = res.data.access_token;
            if (spotifyToken) {
              localStorage.setItem('spotifyAccessToken', spotifyToken);
              alert("✅ Spotify connected successfully!");
              if (onSpotifySuccess) onSpotifySuccess();
            } else {
              alert("Spotify login failed: No token returned.");
            }
  
            const jwtToken = localStorage.getItem('accessToken');
            navigate(jwtToken ? '/' : '/');
          })
          .catch(err => {
            console.error('Spotify auth failed:', err);
            alert("Spotify login failed.");
            navigate('/');
          });
      }
    }, [navigate, onSpotifySuccess]);
  
    return <p>Connecting to Spotify...</p>;
  }
  
  export default Callback;
  