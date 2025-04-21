import React from 'react';

const CLIENT_ID = "fbefddac84bd4e43a494908a10e99ecb";
const REDIRECT_URI = "http://127.0.0.1:3000/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = "user-read-email user-read-private";

function ConnectSpotify() {
  const handleLogin = () => {
    const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&show_dialog=true`;
    window.location.href = loginUrl;
  };

  return (
    <div style={{
      backgroundColor: '#ede9fe',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#9333ea' }}>Connect to Spotify</h2>
        <p style={{ color: '#333', marginBottom: '1.5rem' }}>
          Link your Spotify to start reviewing music!
        </p>
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: '#1DB954',
            color: 'white',
            padding: '0.7rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Connect Spotify
        </button>
      </div>
    </div>
  );
}

export default ConnectSpotify;
