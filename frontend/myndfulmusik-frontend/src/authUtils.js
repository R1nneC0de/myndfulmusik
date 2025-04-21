// src/authUtils.js
import axios from 'axios';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refreshToken
    });

    const newAccessToken = response.data.access;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Django refresh token failed:", error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/'; // Force re-login
    return null;
  }
};
