import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';

function SongList() {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://127.0.0.1:8000/api/songs/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setSongs(response.data);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <h2>Song List</h2>
      {songs.map(song => (
        <div key={song.id} style={{ marginBottom: '2rem' }}>
          <strong>{song.title}</strong> by {song.artist}
          <ReviewForm songId={song.id} onReviewSubmitted={fetchSongs} />
        </div>
      ))}
    </div>
  );
}

export default SongList;
