import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();

  // Function to fetch library items from API
  const fetchLibraryItems = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would fetch data from the API
      // const userId = user?.id;
      // if (!userId) return;
      // 
      // const headers = await getAuthHeaders(userId);
      // const response = await fetch(`/api/library/items?userId=${userId}`, {
      //   headers
      // });
      // 
      // if (response.ok) {
      //   const data = await response.json();
      //   setLibraryItems(data.items || []);
      // }
      
      // For now, we'll continue using mock data
      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching library items:', error);
      setLoading(false);
    }
  };
  
  // Call fetchLibraryItems when component mounts or user changes
  useEffect(() => {
    fetchLibraryItems();
  }, [user]);
  
  // Mock data for library items
  const libraryItems = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      type: 'summary',
      category: 'AI',
      date: '2023-11-15',
      size: '2.5K words',
      status: 'completed'
    },
    {
      id: 2,
      title: 'React Development Guide',
      type: 'research',
      category: 'Programming',
      date: '2023-11-10',
      size: '1.8K words',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Climate Change Analysis',
      type: 'summary',
      category: 'Science',
      date: '2023-11-08',
      size: '3.2K words',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Business Strategy Framework',
      type: 'research',
      category: 'Business',
      date: '2023-11-05',
      size: '2.1K words',
      status: 'completed'
    }
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'summary':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'research':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Library</h1>
        <p className="text-gray-600 text-base md:text-lg">Manage and organize your saved content</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Button 
              onClick={() => setActiveTab('all')}
              variant={activeTab === 'all' ? 'default' : 'outline'}
              className={`text-xs md:text-sm px-3 py-1.5 md:py-2 ${activeTab === 'all' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              All
            </Button>
            <Button 
              onClick={() => setActiveTab('summary')}
              variant={activeTab === 'summary' ? 'default' : 'outline'}
              className={`text-xs md:text-sm px-3 py-1.5 md:py-2 ${activeTab === 'summary' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              Summaries
            </Button>
            <Button 
              onClick={() => setActiveTab('research')}
              variant={activeTab === 'research' ? 'default' : 'outline'}
              className={`text-xs md:text-sm px-3 py-1.5 md:py-2 ${activeTab === 'research' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              Research
            </Button>
          </div>
        </div>
      </div>

      {/* Library Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
              <div className="flex items-start md:items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                    <span className="text-xs md:text-sm text-gray-500">{item.category}</span>
                    <span className="text-xs md:text-sm text-gray-500">{item.size}</span>
                    <span className="text-xs md:text-sm text-gray-500">{item.date}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="outline" size="sm" className="text-xs md:text-sm px-2 md:px-3 py-1 text-gray-700 border-gray-300 hover:bg-gray-50">
                  View
                </Button>
                <Button variant="outline" size="sm" className="text-xs md:text-sm px-2 md:px-3 py-1 text-gray-700 border-gray-300 hover:bg-gray-50">
                  Share
                </Button>
                <Button variant="outline" size="sm" className="text-xs md:text-sm px-2 md:px-3 py-1 text-red-600 border-red-300 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">No items found</h3>
          <p className="text-sm md:text-base text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
