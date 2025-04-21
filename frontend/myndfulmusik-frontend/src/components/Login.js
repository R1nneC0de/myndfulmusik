import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');  // ✅ correctly declared
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      backgroundColor: '#f3e8ff',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '300px'
      }}>
        <h2 style={{ color: '#7e22ce', marginBottom: '1rem', textAlign: 'center' }}>MYndfulMusiK</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#7e22ce',
            color: 'white',
            border: 'none',
            padding: '0.6rem',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
