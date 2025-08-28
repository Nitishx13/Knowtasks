import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/use-toast';

const LibraryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [libraryStats, setLibraryStats] = useState({
    totalDocuments: 0,
    totalSize: 0,
    avgWords: 0,
    recentUploads: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await fetch('/api/library?userId=test-user');
      if (response.ok) {
        const data = await response.json();
        const summariesData = data.summaries || [];
        setSummaries(summariesData);
        
        // Calculate library statistics
        const totalSize = summariesData.reduce((acc, doc) => acc + (doc.fileSize || 0), 0);
        const totalWords = summariesData.reduce((acc, doc) => acc + (doc.wordCount || 0), 0);
        const avgWords = summariesData.length > 0 ? Math.round(totalWords / summariesData.length) : 0;
        const recentUploads = summariesData.filter(doc => {
          const uploadDate = new Date(doc.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return uploadDate > weekAgo;
        }).length;

        setLibraryStats({
          totalDocuments: summariesData.length,
          totalSize,
          avgWords,
          recentUploads
        });
      } else {
        throw new Error('Failed to fetch summaries');
      }
    } catch (error) {
      // Use mock data for demo
      const mockSummaries = [
        {
          id: 1,
          title: 'Machine Learning Basics',
          type: 'PDF',
          fileSize: 2048576,
          wordCount: 2500,
          createdAt: '2023-11-15T10:30:00Z',
          summary: 'Comprehensive overview of machine learning fundamentals...',
          tags: ['AI', 'Machine Learning', 'Education']
        },
        {
          id: 2,
          title: 'React Development Guide',
          type: 'DOCX',
          fileSize: 1536000,
          wordCount: 1800,
          createdAt: '2023-11-14T14:20:00Z',
          summary: 'Complete guide to React development best practices...',
          tags: ['React', 'JavaScript', 'Web Development']
        },
        {
          id: 3,
          title: 'Advanced CSS Techniques',
          type: 'PDF',
          fileSize: 3072000,
          wordCount: 3200,
          createdAt: '2023-11-13T09:15:00Z',
          summary: 'Advanced CSS techniques for modern web design...',
          tags: ['CSS', 'Web Design', 'Frontend']
        }
      ];
      
      setSummaries(mockSummaries);
      
      const totalSize = mockSummaries.reduce((acc, doc) => acc + doc.fileSize, 0);
      const totalWords = mockSummaries.reduce((acc, doc) => acc + doc.wordCount, 0);
      const avgWords = Math.round(totalWords / mockSummaries.length);
      
      setLibraryStats({
        totalDocuments: mockSummaries.length,
        totalSize,
        avgWords,
        recentUploads: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Document Library</h1>
        <p className="text-gray-400 text-lg">Your collection of AI-generated summaries and analyzed documents</p>
      </div>

      {/* Library Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Documents</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{libraryStats.totalDocuments}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>3 new this week</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Size</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatFileSize(libraryStats.totalSize)}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>15% from last week</span>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Avg. Words</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{libraryStats.avgWords.toLocaleString()}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>8% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{libraryStats.recentUploads}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>This week</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border border-blue-500 rounded-xl p-5 flex items-center transition-all duration-300 h-auto">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Upload Document</h3>
              <p className="text-sm text-blue-200">Add new files to library</p>
            </div>
          </Button>

          <Button className="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 border border-green-500 rounded-xl p-5 flex items-center transition-all duration-300 h-auto">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Export Library</h3>
              <p className="text-sm text-green-200">Download all documents</p>
            </div>
          </Button>

          <Button className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border border-purple-500 rounded-xl p-5 flex items-center transition-all duration-300 h-auto">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Organize</h3>
              <p className="text-sm text-purple-200">Manage categories & tags</p>
            </div>
          </Button>
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="text-center">
            <div className="inline-block p-4 rounded-full bg-gray-700 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium mb-2 text-white">No documents yet</h4>
            <p className="text-gray-400 mb-6">Upload your first document to get started</p>
            <Button className="bg-black hover:bg-gray-800 text-white border border-white/30 hover:border-white px-4 py-2 rounded-md font-medium transition-colors">
              + Upload Document
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Words</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {summaries.map((summary) => (
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
                          <div className="text-sm text-gray-400">{summary.summary.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-white/20 text-white">
                        {summary.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatFileSize(summary.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {summary.wordCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(summary.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 mr-3">View</Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">Share</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
