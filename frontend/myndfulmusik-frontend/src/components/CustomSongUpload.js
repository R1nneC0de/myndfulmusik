// src/components/CustomSongUpload.js
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
      onUpload && onUpload();
    } catch (error) {
      console.error(error);
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#6b21a8' }}>Custom Song Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: '0.6rem',
          width: '100%',
          marginBottom: '1.2rem',
          border: '1px solid #c4b5fd',
          borderRadius: '5px',
          fontSize: '1rem'
        }}
      />

      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#6b21a8' }}>Audio File</label>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
        style={{
          padding: '0.6rem',
          width: '100%',
          marginBottom: '1.5rem',
          border: '1px solid #c4b5fd',
          borderRadius: '5px',
          fontSize: '1rem'
        }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: '#7c3aed',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Upload
      </button>

      {message && (
        <p style={{ marginTop: '1rem', color: message.includes('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default CustomSongUpload;
