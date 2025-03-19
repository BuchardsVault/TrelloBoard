import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f4f5f7',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px', // Space between message and buttons
      }}>
        {/* Welcome Message */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#172b4d',
          margin: '0',
          textAlign: 'center',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>Welcome to Your Dashboard</h1>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link to="/settings" style={{ textDecoration: 'none' }}>
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
              Settings
            </button>
          </Link>

          <Link to="/overview" style={{ textDecoration: 'none' }}>
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
              Overview
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;