import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const MentorDashboardNew = () => {
  const [mentorData, setMentorData] = useState(null);
  const [students, setStudents] = useState([]);
  const [contentStats, setContentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication and load data
    const isAuthenticated = localStorage.getItem('isMentorAuthenticated');
    
    if (!isAuthenticated) {
      router.push('/mentor/login-new');
      return;
    }

    // Load mentor data from localStorage
    const storedMentorData = localStorage.getItem('mentorData');
    const storedStudents = localStorage.getItem('mentorStudents');
    const storedContentStats = localStorage.getItem('mentorContentStats');

    if (storedMentorData) {
      setMentorData(JSON.parse(storedMentorData));
    }
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
    if (storedContentStats) {
      setContentStats(JSON.parse(storedContentStats));
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isMentorAuthenticated');
    localStorage.removeItem('mentorData');
    localStorage.removeItem('mentorProfile');
    localStorage.removeItem('mentorStudents');
    localStorage.removeItem('mentorContentStats');
    router.push('/mentor/login-new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load mentor data</p>
          <button
            onClick={() => router.push('/mentor/login-new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {mentorData.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Welcome, {mentorData.name}</h1>
                <p className="text-gray-400">{mentorData.subject} Mentor</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{students.length}</p>
                <p className="text-gray-400 text-sm">Total Students</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {(contentStats.formula_count || 0) + (contentStats.flashcard_count || 0) + (contentStats.pyq_count || 0)}
                </p>
                <p className="text-gray-400 text-sm">Total Uploads</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{mentorData.profile?.total_sessions || 0}</p>
                <p className="text-gray-400 text-sm">Sessions</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{mentorData.profile?.rating || 0}</p>
                <p className="text-gray-400 text-sm">Rating</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Statistics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Content Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Formula Bank</span>
                <span className="text-blue-400 font-semibold">{contentStats.formula_count || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Flashcards</span>
                <span className="text-green-400 font-semibold">{contentStats.flashcard_count || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Previous Year Questions</span>
                <span className="text-purple-400 font-semibold">{contentStats.pyq_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Content
              </button>
              <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Manage Students
              </button>
              <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
              <button className="p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors">
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Your Students</h3>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400">No students assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-300">Student</th>
                    <th className="text-left p-3 text-gray-300">Email</th>
                    <th className="text-left p-3 text-gray-300">Summaries</th>
                    <th className="text-left p-3 text-gray-300">Notes</th>
                    <th className="text-left p-3 text-gray-300">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id || index} className="border-b border-gray-800 hover:bg-gray-700/50">
                      <td className="p-3 text-white">{student.name}</td>
                      <td className="p-3 text-blue-400">{student.email}</td>
                      <td className="p-3 text-green-400">{student.total_summaries || 0}</td>
                      <td className="p-3 text-purple-400">{student.total_notes || 0}</td>
                      <td className="p-3 text-gray-400">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardNew;
