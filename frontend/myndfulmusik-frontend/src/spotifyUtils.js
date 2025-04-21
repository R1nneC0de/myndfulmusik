// src/spotifyUtils.js

export async function refreshSpotifyToken() {
    const refreshToken = localStorage.getItem("spotifyRefreshToken");
  
    if (!refreshToken) {
      console.warn("No Spotify refresh token found.");
      return null;
    }
  
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  
    const encoded = btoa(`${clientId}:${clientSecret}`);
  
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        localStorage.setItem("spotifyAccessToken", data.access_token);
        return data.access_token;
      } else {
        console.error("Failed to refresh token:", data);
        return null;
      }
    } catch (err) {
      console.error("Error refreshing Spotify token:", err);
      return null;
    }
  }
  