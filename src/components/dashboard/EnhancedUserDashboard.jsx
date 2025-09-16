import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders, USER_ROLES, hasPermission, PERMISSIONS } from '../../utils/auth';

const EnhancedUserDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      documents: 0,
      summaries: 0,
      notes: 0,
      flashcards: 0,
      totalItems: 0,
      estimatedTimeSaved: 0,
      monthlyUsage: '0%'
    },
    recentActivity: [],
    upcomingTasks: [],
    studyPlans: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isSignedIn } = useAuth();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const headers = await getAuthHeaders(user.id);
        
        // Fetch user stats
        const statsResponse = await fetch('/api/users/stats', { headers });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          
          // Fetch recent notes for activity
          const notesResponse = await fetch('/api/notes?limit=5', { headers });
          const notesData = notesResponse.ok ? await notesResponse.json() : { notes: [] };
          
          // Fetch study plans
          const plansResponse = await fetch('/api/study-plans', { headers });
          const plansData = plansResponse.ok ? await plansResponse.json() : { studyPlans: [] };
          
          setDashboardData({
            stats,
            recentActivity: notesData.notes.slice(0, 3),
            upcomingTasks: generateUpcomingTasks(stats),
            studyPlans: plansData.studyPlans.slice(0, 2)
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);
  
  const generateUpcomingTasks = (stats) => {
    const tasks = [];
    if (stats.documents > 0 && stats.summaries === 0) {
      tasks.push({ id: 1, title: 'Create summaries for uploaded documents', priority: 'high', dueDate: 'Today' });
    }
    if (stats.notes < 5) {
      tasks.push({ id: 2, title: 'Take more study notes', priority: 'medium', dueDate: 'This week' });
    }
    if (stats.flashcards === 0) {
      tasks.push({ id: 3, title: 'Create flashcards for revision', priority: 'low', dueDate: 'Next week' });
    }
    return tasks;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { stats, recentActivity, upcomingTasks, studyPlans } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Hey {user?.firstName || user?.name || 'Student'} 👋
            </h1>
            <p className="text-sm text-gray-400">Ready to learn something new?</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              {(user?.firstName || user?.name || 'S')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{stats.documents}</p>
            <p className="text-xs md:text-sm text-blue-200">Documents</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{stats.notes}</p>
            <p className="text-xs md:text-sm text-green-200">Notes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{stats.flashcards}</p>
            <p className="text-xs md:text-sm text-purple-200">Flashcards</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{stats.estimatedTimeSaved}</p>
            <p className="text-xs md:text-sm text-orange-200">Min Saved</p>
          </motion.div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Link href="/dashboard/upload-task" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition-all duration-300 border border-gray-700 hover:border-blue-500">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-blue-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">Upload</h3>
                  <p className="text-sm text-gray-400">Upload files & get AI summaries</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/library" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition-all duration-300 border border-gray-700 hover:border-green-500">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-green-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">Knowledge Hub</h3>
                  <p className="text-sm text-gray-400">Browse your documents & summaries</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/data" className="group">
              <div className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition-all duration-300 border border-gray-700 hover:border-purple-500">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">My Data</h3>
                  <p className="text-sm text-gray-400">Manage your notes & content</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Recent Activity
                  <Link href="/dashboard/library" className="text-blue-400 text-sm hover:text-blue-300">
                    View All →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{item.title}</p>
                          <p className="text-gray-400 text-sm">
                            {item.subject && `${item.subject} • `}
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">📝</div>
                    <p className="text-gray-400 mb-4">No recent activity yet</p>
                    <Link href="/dashboard/notes">
                      <Button size="sm">Create Your First Note</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-gray-400 text-xs">{task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">All caught up! 🎉</p>
                )}
              </CardContent>
            </Card>

            {/* Study Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Study Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Weekly Goal</span>
                      <span className="text-white">{Math.min(100, (stats.totalItems / 10) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (stats.totalItems / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
                      <p className="text-xs text-gray-400">Total Items</p>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{Math.floor(stats.estimatedTimeSaved / 60)}h</p>
                      <p className="text-xs text-gray-400">Time Saved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserDashboard;
