import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';

const MentorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      minutesSaved: 1847,
      monthlyUsage: '85.2%'
    },
    statistics: {
      numOfSummaries: 234,
      totalHoursSaved: 30.8,
      avgTimeSaved: '4.5 min'
    },
    recentSummaries: [
      { id: 1, title: 'Student Progress Analysis', createdAt: '2024-01-20T14:30:00Z', wordCount: 890 },
      { id: 2, title: 'Physics Curriculum Update', createdAt: '2024-01-19T11:20:00Z', wordCount: 1240 },
      { id: 3, title: 'Teaching Methodology Review', createdAt: '2024-01-18T16:45:00Z', wordCount: 760 }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { metrics, statistics } = dashboardData;

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Hey there 👋</h1>
        <p className="text-gray-400 text-base md:text-lg">Welcome back to your Mentor dashboard</p>
      </div>

      {/* Educational Context Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        {/* Mentoring Panel */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Student Management</h3>
            <p className="text-sm text-blue-100 mb-3">Track and guide your students' learning progress</p>
            <Link href="/mentor/students" className="inline-block bg-white text-blue-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition-all">
              View Students
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-24 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </div>
        </div>

        {/* Content Creation */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Content Creation</h3>
            <p className="text-sm text-green-100 mb-3">Create and share educational materials with students</p>
            <Link href="/mentor/content" className="inline-block bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-50 transition-all">
              Create Content
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-24 h-full opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Performance Analytics</h3>
            <p className="text-sm text-purple-100 mb-3">Monitor student performance and engagement metrics</p>
            <Link href="/mentor/analytics" className="inline-block bg-white text-purple-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-50 transition-all">
              View Analytics
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-white mb-1">{metrics.monthlyUsage}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>5% from last month</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-lg font-semibold text-white">Total Docs</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-white mb-1">{statistics.numOfSummaries}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>3 new this week</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-4">
            <Link href="/upload" className="flex items-center p-3 bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 border border-gray-700 hover:border-white/30">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Upload Document</h3>
                <p className="text-sm text-gray-400">Add new materials for students</p>
              </div>
            </Link>
            
            <Link href="/mentor/students" className="flex items-center p-3 bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 border border-gray-700 hover:border-white/30">
              <div className="p-2 bg-green-600 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Manage Students</h3>
                <p className="text-sm text-gray-400">Track student progress and performance</p>
              </div>
            </Link>
            
            <Link href="/mentor/content" className="flex items-center p-3 bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 border border-gray-700 hover:border-white/30">
              <div className="p-2 bg-purple-600 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Create Content</h3>
                <p className="text-sm text-gray-400">Develop educational materials</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="bg-black rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Usage Statistics</h2>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Summaries</span>
              <span className="text-white font-semibold">{statistics.numOfSummaries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Hours Saved</span>
              <span className="text-white font-semibold">{statistics.totalHoursSaved}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Avg. Time Saved</span>
              <span className="text-white font-semibold">{statistics.avgTimeSaved}</span>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">This Month</span>
                <span className="text-green-400 font-semibold">+23%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Summaries */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 border border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Summaries</h2>
          <Link href="/dashboard/library" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-gray-400 mt-2">Loading summaries...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : dashboardData.recentSummaries.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-4">No summaries yet</p>
            <Link href="/upload" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Upload Your First Document
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {dashboardData.recentSummaries.map((summary) => (
              <div key={summary.id} className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{summary.title}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{summary.wordCount} words</span>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">View</button>
                    <button className="text-gray-400 hover:text-white">Share</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black rounded-xl shadow-lg p-4 md:p-6 border border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Ready to mentor more effectively?</h3>
          <p className="text-gray-400 mb-4">Upload documents, track student progress, and create engaging content.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Upload Document
            </Link>
            <Link href="/mentor/students" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
              Manage Students
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
