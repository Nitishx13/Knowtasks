import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

const ResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

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
          tags: ['AI', 'Machine Learning', 'Algorithms']
        },
        {
          id: 2,
          title: 'Deep Learning Applications in Healthcare',
          type: 'video',
          source: 'Conference Talk',
          date: '2023-11-10',
          summary: 'Exploring how deep learning is revolutionizing medical diagnosis and treatment planning.',
          url: '#',
          tags: ['Healthcare', 'Deep Learning', 'Medical AI']
        },
        {
          id: 3,
          title: 'Natural Language Processing Trends',
          type: 'article',
          source: 'Tech Blog',
          date: '2023-11-08',
          summary: 'Latest developments in NLP including transformer models and their applications.',
          url: '#',
          tags: ['NLP', 'Transformers', 'AI']
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

  return (
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Research Hub</h1>
        <p className="text-gray-600 text-base md:text-lg">Discover and analyze research materials across various topics</p>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Research Topic
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your research topic or question..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? 'Searching...' : 'Search Research'}
          </Button>
        </form>
      </div>

      {/* Filters */}
      {researchResults.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('article')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'article' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'video' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveFilter('paper')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'paper' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Papers
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching research materials...</p>
        </div>
      )}

      {!isLoading && researchResults.length > 0 && (
        <div className="space-y-6">
          {filteredResults.map((result) => (
            <div key={result.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    result.type === 'video' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {result.type === 'video' ? (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                    <p className="text-sm text-gray-500">{result.source} • {result.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                  View
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4">{result.summary}</p>
              
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && researchResults.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default ResearchPage;