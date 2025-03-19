import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

function Settings() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api');
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        setMessage('Failed to load user data.');
      }
    };

    setUser({ name: currentUser.name || '', email: currentUser.email || '' });
    fetchUserData();
  }, [API_URL, currentUser.id, currentUser.name, currentUser.email]); // Added missing dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setMessage('Please enter your current password.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage('New password and confirmation do not match.');
        return;
      }
    }

    try {
      const updates = {};
      if (user.name !== currentUser.name) updates.name = user.name;
      if (user.email !== currentUser.email) updates.email = user.email;
      if (newPassword) updates.password = newPassword;
      if (currentPassword) updates.currentPassword = currentPassword;

      if (Object.keys(updates).length > 0) {
        await axios.put(
          `${API_URL}/users/${currentUser.id}`,
          updates,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        const updatedUser = { ...currentUser, name: user.name, email: user.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Settings updated successfully!');
      } else {
        setMessage('No changes detected.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating settings:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.error || 'Failed to update settings.');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <h1 className="settings-title">Settings</h1>
        {message && <p className="settings-message">{message}</p>}

        <form onSubmit={handleSave} className="settings-form">
          <div className="settings-section">
            <h2 className="section-title">Profile</h2>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Username"
              className="settings-input"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="settings-input"
            />
          </div>

          <div className="settings-section">
            <h2 className="section-title">Change Password</h2>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="settings-input"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="settings-input"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="settings-input"
            />
          </div>

          <div className="settings-section">
            <h2 className="section-title">Preferences</h2>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="checkbox-input"
              />
              <span>Dark Mode</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="checkbox-input"
              />
              <span>Email Notifications</span>
            </label>
          </div>

          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;