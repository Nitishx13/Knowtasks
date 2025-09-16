import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [realStats, setRealStats] = useState({
    newUsers: 0,
    newMentors: 0
  });
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'mentors', 'users'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCredentials, setShowCredentials] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [showMentorDetails, setShowMentorDetails] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Load simple stats for the dashboard
  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setRealStats({
        newUsers: 12,
        newMentors: 3
      });
    }, 500);
  }, []);

  // Handle URL-based routing for sections
  useEffect(() => {
    const section = router.query.section;
    if (section === 'User Management') {
      setActiveSection('users');
    } else if (section === 'Mentor Management') {
      setActiveSection('mentors');
    } else {
      setActiveSection('overview');
    }
  }, [router.query.section]);

  // Fetch mentor applications when mentors section is active
  useEffect(() => {
    if (activeSection === 'mentors') {
      fetchApplications();
    }
  }, [activeSection]);

  // Handle section navigation with URL updates
  const handleSectionChange = (section) => {
    setActiveSection(section);
    const sectionName = section === 'users' ? 'User Management' : 
                       section === 'mentors' ? 'Mentor Management' : 
                       'overview';
    
    if (section === 'overview') {
      router.push('/admin/dashboard', undefined, { shallow: true });
    } else {
      router.push(`/admin/dashboard?section=${encodeURIComponent(sectionName)}`, undefined, { shallow: true });
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentors/list');
      
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
        setApplications(data.mentors || []);
      } else {
        throw new Error(data.error || 'Failed to fetch mentor applications');
      }
    } catch (err) {
      console.error('Fetch applications error:', err);
      setError(err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification status change
  const handleVerificationChange = async (mentorId, verified) => {
    try {
      // Generate a password for the mentor when verifying
      const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
        let password = '';
        for (let i = 0; i < 12; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

      const password = generatePassword();

      const response = await fetch('/api/mentors/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin'
        },
        body: JSON.stringify({ 
          mentorId, 
          verified,
          password: verified ? password : null // Only send password when verifying
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update verification status');
      }
      
      // Update the local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === mentorId ? { ...app, verified, status: verified ? 'active' : 'pending' } : app
        )
      );
      
      // Show credentials when verifying
      if (verified && data.success) {
        const mentor = applications.find(app => app.id === mentorId);
        setGeneratedCredentials({
          email: mentor.email,
          userId: mentor.email,
          password: password
        });
        setShowCredentials(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle view mentor details
  const handleViewDetails = (mentor) => {
    setSelectedMentor(mentor);
    setShowMentorDetails(true);
  };

  const handleCreateLogin = async (mentorId, email, password) => {
    try {
      const response = await fetch('/api/mentors/create-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin_token'
        },
        body: JSON.stringify({ 
          mentorId,
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Login created successfully!\n\nCredentials:\nEmail: ${email}\nPassword: ${password}\nLogin URL: /mentor/login-new`);
        
        // Refresh mentor list
        fetchApplications();
        setSelectedMentor(null);
        setGeneratedPassword('');
      } else {
        alert('Failed to create login: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating login:', error);
      alert('Failed to create login');
    }
  };

  // Generate or retrieve mentor password
  const handleShowPassword = (mentorId) => {
    // Generate a secure password for the mentor
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const generatedPassword = generatePassword();
    setSelectedMentor(prev => ({ ...prev, password: generatedPassword }));
    setShowPassword(true);
  };

  // Filter applications based on selected filter
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !app.verified;
    if (filter === 'verified') return app.verified;
    return true;
  });

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Hey there 👋</h1>
        <p className="text-gray-400 text-base md:text-lg">Welcome back to your SuperAdmin dashboard</p>
      </div>

      {/* Core Management Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Management Panel */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-blue-200">{realStats.newUsers}</p>
              <p className="text-blue-100 text-sm">Total Users</p>
            </div>
            <p className="text-sm text-blue-100 mb-4">Manage all system users and their permissions</p>
            <Link href="/admin/users" className="inline-block bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all">
              Manage Users
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>

        {/* Mentor Management Panel */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-4">Mentor Management</h3>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-purple-200">{realStats.newMentors}</p>
              <p className="text-purple-100 text-sm">Active Mentors</p>
            </div>
            <p className="text-sm text-purple-100 mb-4">Review applications and manage mentors</p>
            <Link href="/admin/mentor-applications" className="inline-block bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all">
              Manage Mentors
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Users</h3>
            <div className="p-3 bg-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{realStats.newUsers}</p>
          <p className="text-gray-400 text-sm">Registered users in the system</p>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Mentors</h3>
            <div className="p-3 bg-purple-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{realStats.newMentors}</p>
          <p className="text-gray-400 text-sm">Active mentors in the system</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => handleSectionChange('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === 'overview'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleSectionChange('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === 'users'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => handleSectionChange('mentors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === 'mentors'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Mentor Management
          </button>
        </div>
      </div>

      {/* Content based on active section */}
      {activeSection === 'overview' && (
        <>
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Management Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <button 
                onClick={() => handleSectionChange('users')}
                className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border border-blue-500 rounded-xl p-6 flex items-center transition-all duration-300"
              >
                <div className="p-3 bg-white/10 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">User Management</h3>
                  <p className="text-sm text-blue-200">Manage all system users and permissions</p>
                </div>
              </button>

              <button 
                onClick={() => handleSectionChange('mentors')}
                className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border border-purple-500 rounded-xl p-6 flex items-center transition-all duration-300"
              >
                <div className="p-3 bg-white/10 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 616.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Mentor Management</h3>
                  <p className="text-sm text-purple-200">Review applications and manage mentors</p>
                </div>
              </button>

            </div>
          </div>
        </>
      )}

      {activeSection === 'users' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>
          <p className="text-gray-400 mb-4">User management functionality will be implemented here.</p>
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="text-gray-500">User management interface coming soon</p>
          </div>
        </div>
      )}

      {activeSection === 'mentors' && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Mentor Applications</h2>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button 
                variant={filter === 'verified' ? 'default' : 'outline'}
                onClick={() => setFilter('verified')}
                size="sm"
              >
                Verified
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No mentor applications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((mentor) => (
                <Card key={mentor.id} className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{mentor.name}</CardTitle>
                        <CardDescription className="text-gray-400">{mentor.email}</CardDescription>
                      </div>
                      <Badge className={`${mentor.verified ? 'bg-green-500' : 'bg-yellow-500'}`}>
                        {mentor.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-300">Subject:</span>
                        <span className="text-sm text-gray-200">{mentor.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-300">Experience:</span>
                        <span className="text-sm text-gray-200">{mentor.experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-300">Phone:</span>
                        <span className="text-sm text-gray-200">{mentor.phone}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-300">Bio:</span>
                        <p className="text-sm mt-1 line-clamp-3 text-gray-200">{mentor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(mentor)}
                    >
                      View Details
                    </Button>
                    {mentor.verified ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleVerificationChange(mentor.id, false)}
                      >
                        Revoke Access
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setGeneratedPassword('');
                        }}
                      >
                        Create Login
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentials && generatedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Mentor Login Credentials</h2>
              <button
                onClick={() => {
                  setShowCredentials(false);
                  setGeneratedCredentials(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium mb-2">✅ Mentor Approved Successfully!</p>
                <p className="text-green-700 text-sm">
                  Login credentials have been generated for {generatedCredentials.email}
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                    {generatedCredentials.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                    {generatedCredentials.userId}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                    {generatedCredentials.password}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> Please save these credentials securely. 
                  The mentor will use these to login at <code>/mentor/login-new</code>
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Email: ${generatedCredentials.email}\nUser ID: ${generatedCredentials.userId}\nPassword: ${generatedCredentials.password}`
                    );
                    alert('Credentials copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Credentials
                </button>
                <button
                  onClick={() => {
                    setShowCredentials(false);
                    setGeneratedCredentials(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Login Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create Login for {selectedMentor.name}</h2>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedMentor.email}
                    readOnly
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="text"
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    placeholder="Enter password for mentor"
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateLogin(selectedMentor.id, selectedMentor.email, generatedPassword)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={!generatedPassword}
                >
                  Create Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Details Modal */}
      {showMentorDetails && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Mentor Details</h2>
              <button
                onClick={() => {
                  setShowMentorDetails(false);
                  setSelectedMentor(null);
                  setShowPassword(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="p-3 bg-gray-700 rounded-lg text-white">
                    {selectedMentor.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="p-3 bg-gray-700 rounded-lg text-white">
                    {selectedMentor.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <div className="p-3 bg-gray-700 rounded-lg text-white">
                    {selectedMentor.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <div className="p-3 bg-gray-700 rounded-lg text-white">
                    {selectedMentor.subject}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <div className="p-3 bg-gray-700 rounded-lg text-white">
                    {selectedMentor.experience} years
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <Badge className={`${selectedMentor.verified ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {selectedMentor.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Biography</label>
                <div className="p-4 bg-gray-700 rounded-lg text-white">
                  {selectedMentor.bio}
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Login Credentials</h3>
                  {!showPassword && (
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Create Login
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                    <div className="p-3 bg-gray-700 rounded-lg text-white font-mono">
                      {selectedMentor.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="p-3 bg-gray-700 rounded-lg text-white font-mono flex justify-between items-center">
                      {showPassword && selectedMentor.password ? (
                        <>
                          <span>{selectedMentor.password}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedMentor.password);
                              alert('Password copied to clipboard!');
                            }}
                            className="ml-2 text-blue-400 hover:text-blue-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">••••••••</span>
                      )}
                    </div>
                  </div>
                </div>

                {showPassword && selectedMentor.password && (
                  <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      <strong>Login URL:</strong> <code>/mentor/login-new</code>
                    </p>
                    <p className="text-blue-300 text-sm mt-1">
                      The mentor can use their email and this password to access the mentor dashboard.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-700">
                <div className="flex space-x-3">
                  {selectedMentor.verified ? (
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        handleVerificationChange(selectedMentor.id, false);
                        setShowMentorDetails(false);
                      }}
                    >
                      Revoke Access
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      onClick={() => {
                        handleVerificationChange(selectedMentor.id, true);
                        setShowMentorDetails(false);
                      }}
                    >
                      Verify & Activate
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMentorDetails(false);
                    setSelectedMentor(null);
                    setShowPassword(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminDashboard;
