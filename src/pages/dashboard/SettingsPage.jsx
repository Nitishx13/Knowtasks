import React, { useState } from 'react';

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    name: 'User Name',
    email: 'user@example.com',
    notifications: true
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the settings to a backend
    alert('General settings saved!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Here you would typically update the password in a backend
    alert('Password updated!');
    setPasswordSettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
            <nav>
              <ul className="space-y-1">
                <li>
                  <a href="#general" className="block p-3 rounded-md bg-primary/10 text-primary">
                    General Settings
                  </a>
                </li>
                <li>
                  <a href="#security" className="block p-3 rounded-md hover:bg-gray-100">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#notifications" className="block p-3 rounded-md hover:bg-gray-100">
                    Notifications
                  </a>
                </li>
                <li>
                  <a href="#data" className="block p-3 rounded-md hover:bg-gray-100">
                    Data & Privacy
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2">
          {/* General Settings */}
          <div id="general" className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <form onSubmit={handleGeneralSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={generalSettings.name}
                  onChange={handleGeneralChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={generalSettings.email}
                  onChange={handleGeneralChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={generalSettings.notifications}
                  onChange={handleGeneralChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium" htmlFor="notifications">
                  Enable Notifications
                </label>
              </div>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div id="security" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordSettings.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordSettings.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordSettings.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;