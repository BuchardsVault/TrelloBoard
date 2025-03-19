import React, { useState } from 'react';
import './Settings.css';

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
    <div className="settings-container">
      <div className="settings-content">
        {/* Settings Header */}
        <h1 className="settings-title">Settings</h1>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="settings-form">
          {/* Profile Section */}
          <div className="settings-section">
            <h2 className="section-title">Profile</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="settings-input"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="settings-input"
            />
          </div>

          {/* Password Section */}
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

          {/* Preferences Section */}
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

          {/* Save Button */}
          <button type="submit" className="save-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;