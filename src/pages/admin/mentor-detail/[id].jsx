import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MentorDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  // Fetch mentor details
  useEffect(() => {
    if (!id) return;

    const fetchMentorDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mentors/detail/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        let data;
        
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid response format from server');
        }
        
        if (data.success) {
          setMentor(data.mentor);
          setPassword(data.password || '');
        } else {
          throw new Error(data.error || 'Failed to fetch mentor details');
        }
      } catch (err) {
        console.error('Fetch mentor details error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentorDetails();
  }, [id]);

  // Generate new password
  const generateNewPassword = async () => {
    try {
      const response = await fetch(`/api/mentors/generate-password/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin' // For testing
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPassword(data.password);
        setShowPassword(true);
      } else {
        throw new Error(data.error || 'Failed to generate new password');
      }
    } catch (err) {
      console.error('Generate password error:', err);
      setError(err.message);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/admin/mentor-applications" className="text-blue-600 hover:underline">
            ← Back to Mentor Applications
          </Link>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Mentor not found</div>
          <Link href="/admin/mentor-applications" className="text-blue-600 hover:underline">
            ← Back to Mentor Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/mentor-applications" className="text-gray-400 hover:text-gray-600 mr-4">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mentor Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mentor.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : mentor.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {mentor.status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900">{mentor.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{mentor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900">{mentor.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Subject</label>
                  <p className="text-gray-900">{mentor.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Specialization</label>
                  <p className="text-gray-900">{mentor.specialization || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
                  <p className="text-gray-900">{mentor.experience} years</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bio</h2>
              <p className="text-gray-700 leading-relaxed">
                {mentor.bio || 'No bio provided'}
              </p>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                  <p className="text-gray-900 font-mono">{mentor.user_id || 'Not generated'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <p className="text-gray-900">{mentor.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Verified</label>
                  <p className="text-gray-900">{mentor.verified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                  <p className="text-gray-900">
                    {mentor.created_at ? new Date(mentor.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                  <p className="text-gray-900">
                    {mentor.last_login ? new Date(mentor.last_login).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Login Credentials */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Login Credentials</h2>
              
              {mentor.user_id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border flex-1">
                        {mentor.user_id}
                      </p>
                      <button
                        onClick={() => copyToClipboard(mentor.user_id)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border flex-1">
                        {showPassword ? password : '••••••••••••'}
                      </p>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => copyToClipboard(password)}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={generateNewPassword}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    Generate New Password
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No credentials generated yet</p>
                  <button
                    onClick={generateNewPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Generate Credentials
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href={`/mentor/login-new`}
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center"
                >
                  Test Login
                </Link>
                <button
                  onClick={() => window.open(`mailto:${mentor.email}`, '_blank')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Send Email
                </button>
                <Link
                  href="/admin/mentor-applications"
                  className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-center"
                >
                  Back to Applications
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
