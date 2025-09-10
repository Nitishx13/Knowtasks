import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import MentorManagement from '../../components/admin/MentorManagement';

const SuperAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      minutesSaved: 2847,
      monthlyUsage: '98.5%'
    },
    statistics: {
      numOfSummaries: 456,
      totalHoursSaved: 47.5,
      avgTimeSaved: '6.2 min'
    },
    recentSummaries: [
      { id: 1, title: 'System Performance Report', createdAt: '2024-01-20T10:30:00Z', wordCount: 1250 },
      { id: 2, title: 'User Analytics Summary', createdAt: '2024-01-19T15:45:00Z', wordCount: 980 },
      { id: 3, title: 'Security Audit Results', createdAt: '2024-01-18T09:15:00Z', wordCount: 1560 }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { metrics, statistics } = dashboardData;

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Hey there 👋</h1>
        <p className="text-gray-400 text-base md:text-lg">Welcome back to your SuperAdmin dashboard</p>
      </div>

      {/* Educational Context Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        {/* SuperAdmin Panel */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">System Management</h3>
            <p className="text-sm text-red-100 mb-3">Monitor and manage all system operations and users</p>
            <Link href="/admin/users" className="inline-block bg-white text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-50 transition-all">
              Manage Users
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-24 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </div>
        </div>

        {/* Analytics Panel */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Analytics & Reports</h3>
            <p className="text-sm text-purple-100 mb-3">View system analytics and generate comprehensive reports</p>
            <Link href="/admin/analytics" className="inline-block bg-white text-purple-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-50 transition-all">
              View Analytics
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-24 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
        </div>

        {/* Security Panel */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Security & Monitoring</h3>
            <p className="text-sm text-green-100 mb-3">Monitor system security and access logs</p>
            <Link href="/admin/security" className="inline-block bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-50 transition-all">
              Security Center
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-24 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {/* Metrics Cards - First Row */}
        <div className="bg-black rounded-xl shadow-lg p-4 md:p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-sm md:text-lg font-semibold text-white">Minutes Saved</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-white mb-1">{metrics.minutesSaved}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>12% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-lg font-semibold text-white">Docs Processed</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-white mb-1">{statistics.numOfSummaries}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>8% from last week</span>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-lg font-semibold text-white">Monthly Usage</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-white mb-1">{metrics.monthlyUsage}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>15% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-lg font-semibold text-white">Hours Saved</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-white mb-1">{statistics.totalHoursSaved}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>22% from last week</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

          <Link href="/admin/users" className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border border-red-500 rounded-xl p-3 md:p-5 flex items-center transition-all duration-300">
            <div className="p-2 md:p-3 bg-white/10 rounded-lg mr-2 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">User Management</h3>
              <p className="text-xs md:text-sm text-red-200">Manage system users</p>
            </div>
          </Link>

          <Link href="/admin/analytics" className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border border-purple-500 rounded-xl p-3 md:p-5 flex items-center transition-all duration-300">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H9zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Analytics</h3>
              <p className="text-xs md:text-sm text-purple-200">System reports</p>
            </div>
          </Link>

          <Link href="/admin/security" className="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 border border-green-500 rounded-xl p-3 md:p-5 flex items-center transition-all duration-300">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Security</h3>
              <p className="text-xs md:text-sm text-green-200">Monitor & protect</p>
            </div>
          </Link>

          <Link href="/admin/settings" className="bg-gradient-to-br from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-gray-700 rounded-xl p-3 md:p-5 flex items-center transition-all duration-300">
            <div className="p-2 md:p-3 bg-white/10 rounded-lg mr-2 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">System Settings</h3>
              <p className="text-xs md:text-sm text-gray-400">Configure system</p>
            </div>
          </Link>

        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 space-y-2 md:space-y-0">
              <h3 className="text-lg md:text-xl font-semibold text-white">System Analytics</h3>
              <div className="flex space-x-1 md:space-x-2">
                <button className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md hover:bg-gray-700">Week</button>
                <button className="px-3 py-1 bg-white text-black text-sm rounded-md">Month</button>
                <button className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md hover:bg-gray-700">Year</button>
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-40 md:h-64 bg-black/30 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H9zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400">System analytics visualization</p>
                <p className="text-gray-500 text-sm mt-1">Real-time performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Recent Summaries</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {dashboardData.recentSummaries.slice(0, 3).map((summary) => (
                <div key={summary.id} className="p-3 md:p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <h4 className="font-medium text-white text-sm md:text-base mb-1 md:mb-2 line-clamp-2">{summary.title}</h4>
                  <div className="flex justify-between items-center text-xs md:text-sm text-gray-400">
                    <span>{new Date(summary.createdAt).toLocaleDateString()}</span>
                    <span>{summary.wordCount} words</span>
                  </div>
                </div>
              ))}
              
              {dashboardData.recentSummaries.length === 0 && (
                <div className="text-center py-6 md:py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 text-sm">No summaries yet</p>
                  <p className="text-gray-500 text-xs mt-1">Start by uploading documents</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 md:py-6 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          2024 Knowtasks. All rights reserved. | 
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300 ml-1">Privacy Policy</Link> | 
          <Link href="/terms" className="text-blue-400 hover:text-blue-300 ml-1">Terms of Service</Link>
        </p>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
