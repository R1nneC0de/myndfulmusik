import React from 'react';

const CLIENT_ID = "fbefddac84bd4e43a494908a10e99ecb"; // Replace with your actual Spotify Client ID
const REDIRECT_URI = "http://127.0.0.1:3000/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = "user-read-email user-read-private"; // Add more if needed

function ConnectSpotify() {
  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <button onClick={handleLogin}>Connect with Spotify</button>
    </div>
  );
}

export default ConnectSpotify;
