import React, { useState } from 'react';
import axios from 'axios';

function CustomSongForm({ onUpload }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('customSongTitle', title);
    formData.append('audioFile', file);

    try {
      await axios.post('http://127.0.0.1:8000/api/customsongs/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setFile(null);
      onUpload && onUpload();
    } catch (err) {
      console.error(err);
      setError('Failed to upload custom song.');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h4>Upload Custom Song</h4>
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <br />
      <button type="submit">Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default CustomSongForm;
