import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typedText, setTypedText] = useState('');
  const [error, setError] = useState('');
  const fullText = 'Trello, task management made simple.';
  const navigate = useNavigate();
  
  // Use relative URL for production, fallback to localhost for local dev
  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api');

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.error || 'Login failed. Please check your connection or credentials.');
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f4f5f7',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#172b4d',
          margin: '0',
          textAlign: 'center',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>{typedText}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#5a67d8')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#5a67d8')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#fff',
              background: 'linear-gradient(135deg, #5a67d8, #434190)',
              border: 'none',
              borderRadius: '50px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              outline: 'none',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
          >
            Login
          </button>
        </form>
        <Link to="/create-account" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#fff',
            background: 'linear-gradient(135deg, #5a67d8, #434190)',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            outline: 'none',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          }}>
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
