import React, { useState } from 'react';
import axios from 'axios';

function CustomSongUpload({ onUpload }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('customSongTitle', title);
    formData.append('audioFilePath', file);

    try {
      await axios.post('http://127.0.0.1:8000/api/customsongs/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setFile(null);
      setMessage('✅ Upload successful!');
      onUpload(); // Optional: callback to refresh list
    } catch (error) {
      console.error(error);
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <h3>Upload Your Custom Song</h3>
      <input
        type="text"
        value={title}
        placeholder="Custom Song Title"
        onChange={(e) => setTitle(e.target.value)}
        required
      /><br /><br />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      /><br /><br />
      <button type="submit">Upload</button>
      <p>{message}</p>
    </form>
  );
}

export default CustomSongUpload;
