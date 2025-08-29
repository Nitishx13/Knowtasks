import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';


const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      minutesSaved: 0,
      monthlyUsage: '0%'
    },
    statistics: {
      numOfSummaries: 0,
      totalHoursSaved: 0,
      avgTimeSaved: '0 min'
    },
    recentSummaries: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user-specific text files
        if (user?.id) {
          const response = await fetch(`/api/text/list?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            const files = data.files || [];
            
            // Calculate statistics based on user's files
            const numOfSummaries = files.length;
            const totalWords = files.reduce((sum, file) => sum + (file.wordCount || 0), 0);
            const avgWordsPerFile = numOfSummaries > 0 ? Math.round(totalWords / numOfSummaries) : 0;
            
            // Estimate time saved (assuming 200 words per minute reading speed)
            const minutesSaved = Math.round(totalWords / 200);
            const totalHoursSaved = (minutesSaved / 60).toFixed(1);
            
            // Format recent summaries
            const recentSummaries = files.slice(0, 3).map(file => ({
              id: file.id,
              title: file.title,
              date: file.formattedDate,
              type: 'Text',
              words: file.wordCount
            }));
            
            setDashboardData({
              metrics: {
                minutesSaved,
                monthlyUsage: `${Math.min(100, numOfSummaries * 5)}%`
              },
              statistics: {
                numOfSummaries,
                totalHoursSaved,
                avgTimeSaved: `${Math.round(minutesSaved / numOfSummaries) || 0} min`
              },
              recentSummaries
            });
          }
        } else {
          // Fallback to mock data if no user ID
          setDashboardData({
            metrics: {
              minutesSaved: 0,
              monthlyUsage: '0%'
            },
            statistics: {
              numOfSummaries: 0,
              totalHoursSaved: 0,
              avgTimeSaved: '0 min'
            },
            recentSummaries: []
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
  }, []);
  
  const { metrics, statistics, recentSummaries } = dashboardData;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Hey there 👋</h1>
        <p className="text-gray-400 text-lg">Welcome back to your dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Metrics Cards - First Row */}
        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Minutes Saved</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{metrics.minutesSaved}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>12% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Documents Processed</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{statistics.numOfSummaries}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>8% from last week</span>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Monthly Usage</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{metrics.monthlyUsage}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>5% from last month</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Documents</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{statistics.numOfSummaries}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>3 new this week</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


          <Link href="/dashboard/research" className="bg-gradient-to-br from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-gray-700 rounded-xl p-5 flex items-center transition-all duration-300">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Research</h3>
              <p className="text-sm text-gray-400">Deep dive into topics</p>
            </div>
          </Link>

          <Link href="/dashboard/summarize" className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border border-blue-500 rounded-xl p-5 flex items-center transition-all duration-300">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Summarize</h3>
              <p className="text-sm text-blue-200">AI-powered summaries</p>
            </div>
          </Link>




        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Usage Statistics</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md hover:bg-gray-700">Week</button>
                <button className="px-3 py-1 bg-white text-black text-sm rounded-md">Month</button>
                <button className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md hover:bg-gray-700">Year</button>
              </div>
            </div>
            
            {/* Placeholder for chart - in a real app, you'd use a charting library */}
            <div className="h-64 bg-black/30 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400">Usage statistics visualization</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Total Hours Saved</p>
                <p className="text-2xl font-bold text-white">{statistics.totalHoursSaved}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Avg. Time Saved</p>
                <p className="text-2xl font-bold text-white">{statistics.avgTimeSaved}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Efficiency Rate</p>
                <p className="text-2xl font-bold text-white">87%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 h-full">
            <h3 className="text-xl font-semibold text-white mb-6">Premium Status</h3>
            <div className="bg-gradient-to-br from-white/10 to-gray-800/30 p-6 rounded-lg border border-gray-700 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-white">Pro Plan</h4>
                <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">Your subscription renews on <span className="text-white font-medium">Nov 15, 2023</span></p>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Monthly Usage</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-white/70 to-gray-400 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-black hover:bg-gray-800 text-white border border-white/30 hover:border-white rounded-md transition-colors">Manage Subscription</button>
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Need help with your account?</p>
                <a href="#" className="text-white hover:text-gray-300 text-sm font-medium">Contact Support →</a>
              </div>
            </div>
          </div>
        </div>

      {/* Recent Summaries Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
          <Link href="/dashboard/library" className="text-white hover:text-gray-300 text-sm font-medium">View All →</Link>
        </div>
        
        {recentSummaries.length > 0 ? (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Words</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentSummaries.map((summary) => (
                    <tr key={summary.id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-white/20 rounded-md flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{summary.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-white/20 text-white">
                          {summary.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {summary.words}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {summary.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href="/dashboard/library" className="text-white hover:text-gray-300 mr-3">View</Link>
                        <button className="text-gray-400 hover:text-gray-300">Share</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-gray-700 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="text-lg font-medium mb-2 text-white">No documents yet</h4>
              <p className="text-gray-400 mb-6">Get started by uploading your first document.</p>
              <Link href="/dashboard/library" className="bg-black hover:bg-gray-800 text-white border border-white/30 hover:border-white px-4 py-2 rounded-md font-medium transition-colors inline-block">
                + Upload Document
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer with AI message */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-800 mt-8">
        <p>🤖 Powered by Knowtasks</p>
      </div>
    </>
  );
};

export default DashboardPage;