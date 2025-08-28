import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';

const ResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [researchStats, setResearchStats] = useState({
    totalSearches: 0,
    totalResults: 0,
    avgResults: 0,
    recentSearches: 0
  });

  useEffect(() => {
    // Load mock research statistics
    setResearchStats({
      totalSearches: 47,
      totalResults: 284,
      avgResults: 6,
      recentSearches: 8
    });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: 'Machine Learning Fundamentals',
          type: 'article',
          source: 'Research Paper',
          date: '2023-11-15',
          summary: 'Comprehensive overview of machine learning basics including supervised and unsupervised learning algorithms.',
          url: '#',
          tags: ['AI', 'Machine Learning', 'Algorithms'],
          relevance: 95,
          readTime: '8 min'
        },
        {
          id: 2,
          title: 'Deep Learning Applications in Healthcare',
          type: 'video',
          source: 'Conference Talk',
          date: '2023-11-10',
          summary: 'Exploring how deep learning is revolutionizing medical diagnosis and treatment planning.',
          url: '#',
          tags: ['Healthcare', 'Deep Learning', 'Medical AI'],
          relevance: 92,
          readTime: '15 min'
        },
        {
          id: 3,
          title: 'Natural Language Processing Trends',
          type: 'article',
          source: 'Tech Blog',
          date: '2023-11-08',
          summary: 'Latest developments in NLP including transformer models and their applications.',
          url: '#',
          tags: ['NLP', 'Transformers', 'AI'],
          relevance: 88,
          readTime: '12 min'
        },
        {
          id: 4,
          title: 'Computer Vision in Autonomous Vehicles',
          type: 'research',
          source: 'Academic Journal',
          date: '2023-11-05',
          summary: 'Advanced computer vision techniques for autonomous vehicle navigation and safety systems.',
          url: '#',
          tags: ['Computer Vision', 'Autonomous Vehicles', 'Safety'],
          relevance: 85,
          readTime: '20 min'
        },
        {
          id: 5,
          title: 'Quantum Computing Applications',
          type: 'article',
          source: 'Science Magazine',
          date: '2023-11-03',
          summary: 'Exploring practical applications of quantum computing in cryptography and optimization.',
          url: '#',
          tags: ['Quantum Computing', 'Cryptography', 'Optimization'],
          relevance: 82,
          readTime: '18 min'
        }
      ];
      
      setResearchResults(mockResults);
      setIsLoading(false);
    }, 2000);
  };

  const filteredResults = researchResults.filter(result => {
    if (activeFilter === 'all') return true;
    return result.type === activeFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Research Hub</h1>
        <p className="text-gray-400 text-lg">Discover and analyze research materials across various topics</p>
      </div>

      {/* Research Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Searches</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{researchStats.totalSearches}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>12% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Results</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{researchStats.totalResults}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>8% from last week</span>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Avg. Results</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{researchStats.avgResults}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>per search</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Searches</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{researchStats.recentSearches}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>This week</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
              Research Topic
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your research topic or question..."
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? 'Searching...' : 'Search Research'}
          </Button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 border border-green-500 rounded-xl p-5 flex items-center transition-all duration-300 h-auto">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Browse Topics</h3>
              <p className="text-sm text-green-200">Explore popular research areas</p>
            </div>
          </Button>

          <Button className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border border-purple-500 rounded-xl p-5 flex items-center transition-all duration-300 h-auto">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Saved Research</h3>
              <p className="text-sm text-purple-200">View your bookmarked items</p>
            </div>
          </Button>

          <Button className="bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 border border-orange-500 rounded-xl p-5 flex items-center transition-all duration-300 h-auto">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Research History</h3>
              <p className="text-sm text-orange-200">View past searches</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {researchResults.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All ({researchResults.length})
            </button>
            <button
              onClick={() => setActiveFilter('article')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'article'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Articles ({researchResults.filter(r => r.type === 'article').length})
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'video'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Videos ({researchResults.filter(r => r.type === 'video').length})
            </button>
            <button
              onClick={() => setActiveFilter('research')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'research'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Research ({researchResults.filter(r => r.type === 'research').length})
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Searching research databases...</p>
          </div>
        </div>
      ) : researchResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{result.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      result.type === 'article' ? 'bg-blue-500/20 text-blue-300' :
                      result.type === 'video' ? 'bg-green-500/20 text-green-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {result.type}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300">
                      {result.relevance}% relevant
                    </span>
                  </div>
                  <p className="text-gray-400 mb-3">{result.summary}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{result.source}</span>
                    <span>•</span>
                    <span>{formatDate(result.date)}</span>
                    <span>•</span>
                    <span>{result.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    {result.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery && !isLoading ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try adjusting your search terms or browse popular topics</p>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Start your research</h3>
          <p className="text-gray-400">Enter a topic above to discover relevant research materials</p>
        </div>
      )}
    </div>
  );
};

export default ResearchPage;