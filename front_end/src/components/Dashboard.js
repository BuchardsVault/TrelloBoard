import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User'); // Default fallback

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.name) {
          setUserName(user.name); // Set name from stored user object
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        // Optionally redirect to login if data is corrupt
        navigate('/login');
      }
    } else {
      // No user data found, redirect to login
      navigate('/login');
    }
  }, [navigate]); // Add navigate as dependency

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Logout Button */}
      <button className="dashboard-button logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Message */}
        <h1 className="dashboard-title">Welcome {userName}</h1>

        {/* Navigation Buttons */}
        <div className="dashboard-buttons">
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <button className="dashboard-button">Settings</button>
          </Link>
          <Link to="/overview" style={{ textDecoration: 'none' }}>
            <button className="dashboard-button">Overview</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;