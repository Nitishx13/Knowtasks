import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add your profile update logic here
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Add your password update logic here
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async () => {
    setLoading(true);
    try {
      // Add your notification settings update logic here
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handle2FAEnable = async () => {
    setLoading(true);
    try {
      // Add your 2FA enable logic here
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </Button>
          <Button
            variant={activeTab === 'security' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('security')}
          >
            Security
          </Button>
        </div>

        <div className="space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleNotificationChange('emailNotifications')}
                    className={notifications.emailNotifications ? 'bg-gray-900 text-white' : ''}
                  >
                    {notifications.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive push notifications</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleNotificationChange('pushNotifications')}
                    className={notifications.pushNotifications ? 'bg-gray-900 text-white' : ''}
                  >
                    {notifications.pushNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Weekly Digest</h3>
                    <p className="text-sm text-gray-500">Get weekly summary emails</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleNotificationChange('weeklyDigest')}
                    className={notifications.weeklyDigest ? 'bg-gray-900 text-white' : ''}
                  >
                    {notifications.weeklyDigest ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleNotificationSubmit}
                    className="bg-gray-900 text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Change Password</h3>
                  <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <Button 
                      type="submit"
                      className="bg-gray-900 text-white hover:bg-gray-800"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={handle2FAEnable}
                    disabled={loading}
                  >
                    {loading ? 'Enabling...' : 'Enable 2FA'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;