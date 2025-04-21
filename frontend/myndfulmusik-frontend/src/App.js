import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import SongList from './components/SongList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectSpotify from './components/ConnectSpotify';
import Callback from './components/Callback';
import SongDetail from './components/SongDetail';
import Profile from './components/Profile';
import CustomUploadPage from './components/CustomUploadPage';
import CustomSongUpload from './components/CustomSongUpload';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const spotifyToken = localStorage.getItem('spotifyAccessToken');
    setIsLoggedIn(!!accessToken);
    setIsSpotifyConnected(!!spotifyToken);
  }, []);

  return (
    <Router>
      <Routes>
  <Route
    path="/"
    element={
      isLoggedIn ? (
        <SongList />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )
    }
  />
  <Route path="/connect" element={<ConnectSpotify />} />
  <Route path="/callback" element={
    <Callback onSpotifySuccess={() => setIsSpotifyConnected(true)} />
  } />
  <Route path="/songs/:id" element={<SongDetail />} />
  <Route path="*" element={<p>404 - Page Not Found</p>} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/upload" element={<CustomUploadPage />} />
  <Route path="/custom-upload" element={<CustomSongUpload />} />


</Routes>

    </Router>
  );
}

export default App;
