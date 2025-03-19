import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typedText, setTypedText] = useState('');
  const [error, setError] = useState('');
  const fullText = 'Trello, task management made simple.';
  const navigate = useNavigate();
  
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
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">{typedText}</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <Link to="/create-account" style={{ textDecoration: 'none' }}>
          <button className="create-account-button">Create Account</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;