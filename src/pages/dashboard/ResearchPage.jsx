import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

const ResearchPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Sample research topics for suggestions
  const suggestedTopics = [
    'Quantum Computing Basics',
    'Climate Change Effects',
    'Artificial Intelligence Ethics',
    'Renewable Energy Sources',
    'Behavioral Economics',
    'Neural Networks',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        summary: `Research results for "${query}"`,
        sources: [
          { title: 'Understanding ' + query, url: '#', publisher: 'Academic Journal', date: '2023' },
          { title: query + ' and Its Applications', url: '#', publisher: 'Research Gate', date: '2022' },
          { title: 'The Future of ' + query, url: '#', publisher: 'Science Direct', date: '2023' },
        ],
        relatedTopics: [
          query + ' in Modern Context',
          'Advanced ' + query + ' Techniques',
          'History of ' + query,
          query + ' Case Studies',
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Research Assistant</h1>
        <p className="text-gray-400 text-lg">Get comprehensive research on any topic</p>
      </div>

      {/* Search Section */}
      <div className="bg-black backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a research topic or question..."
              className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 px-6 py-2 bg-black text-white border border-white rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Researching...
                </span>
              ) : 'Research'}
            </button>
          </div>
        </form>

        {/* Suggested Topics */}
        {!results && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Suggested Topics</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(topic)}
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-full hover:bg-gray-700 transition-colors duration-300"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Researching your topic...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
        </div>
      )}

      {results && !isLoading && (
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-black backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Summary</h2>
            <p className="text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
            </p>
            <div className="mt-4 flex justify-end">
              <button className="text-white hover:text-gray-300 text-sm font-medium flex items-center">
                <span>Generate Detailed Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sources */}
          <div className="bg-black backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Sources</h2>
            <div className="space-y-4">
              {results.sources.map((source, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div>
                    <h3 className="text-white font-medium">{source.title}</h3>
                    <p className="text-sm text-gray-400">{source.publisher} • {source.date}</p>
                  </div>
                  <a href={source.url} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-300">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Related Topics */}
          <div className="bg-black backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Related Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.relatedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(topic)}
                  className="p-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-300 text-left flex justify-between items-center"
                >
                  <span>{topic}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setResults(null)} 
              className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Research
            </button>
            <button className="px-6 py-3 bg-black text-white border border-white rounded-xl hover:bg-gray-800 transition-colors duration-300 flex items-center">
              Save Research
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer with AI message */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-800 mt-8">
        <p>🤖 Powered by Knowtasks</p>
      </div>
    </>
  );
};

export default ResearchPage;