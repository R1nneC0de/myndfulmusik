// src/components/CustomUploadPage.js
import React from 'react';
import CustomSongUpload from './CustomSongUpload';
import { useNavigate } from 'react-router-dom';

function CustomUploadPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f3e8ff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#6b21a8' }}>🎙️ Upload Your Custom Song</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Home
        </button>
      </div>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        marginTop: '2rem',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
      }}>
        <CustomSongUpload />
      </div>
    </div>
  );
}

export default CustomUploadPage;
