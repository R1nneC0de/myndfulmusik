// src/components/CustomUploadPage.js
import React from 'react';
import CustomSongUpload from './CustomSongUpload';

function CustomUploadPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎙️ Upload Your Custom Song</h2>
      <CustomSongUpload />
    </div>
  );
}

export default CustomUploadPage;
