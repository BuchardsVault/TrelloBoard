import React, { useState } from 'react';

function Settings() {
  const [username, setUsername] = useState('johndoe'); // Placeholder data
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    // Placeholder for backend integration
    console.log({
      username,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
      darkMode,
      notifications,
    });
    alert('Settings saved! (Placeholder action)');
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
        maxWidth: '500px', // Wider than Login for more fields
      }}>
        {/* Settings Header */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#172b4d',
          margin: '0',
          textAlign: 'center',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>Settings</h1>

        {/* Settings Form */}
        <form onSubmit={handleSave} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}>
          {/* Profile Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '20px', color: '#172b4d', margin: '0' }}>Profile</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
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
          </div>

          {/* Password Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '20px', color: '#172b4d', margin: '0' }}>Change Password</h2>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
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
          </div>

          {/* Preferences Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ fontSize: '20px', color: '#172b4d', margin: '0' }}>Preferences</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontSize: '16px', color: '#333' }}>Dark Mode</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontSize: '16px', color: '#333' }}>Email Notifications</span>
            </label>
          </div>

          {/* Save Button */}
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
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;