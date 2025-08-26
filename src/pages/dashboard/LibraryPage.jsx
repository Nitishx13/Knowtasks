import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSummaries } from '../../hooks/use-summaries';
import { useToast } from '../../hooks/use-toast';

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { summaries, isLoading, error, refetch } = useSummaries();
  const { toast } = useToast();
  
  // Format summaries as library items
  const libraryItems = summaries.map(summary => ({
    id: summary.id,
    title: summary.title,
    type: 'summary',
    category: summary.documentType || 'Document',
    date: new Date(summary.createdAt).toLocaleDateString(),
    size: `${summary.wordCount || 0} words`,
    status: 'completed',
    fileName: summary.fileName,
    originalData: summary
  }));

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
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Library</h1>
        <p className="text-gray-600 text-base md:text-lg">Manage and organize your saved content</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setActiveTab('all')}
              variant={activeTab === 'all' ? 'default' : 'outline'}
              className={activeTab === 'all' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}
            >
              All
            </Button>
            <Button 
              onClick={() => setActiveTab('summary')}
              variant={activeTab === 'summary' ? 'default' : 'outline'}
              className={activeTab === 'summary' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}
            >
              Summaries
            </Button>
            <Button 
              onClick={() => setActiveTab('research')}
              variant={activeTab === 'research' ? 'default' : 'outline'}
              className={activeTab === 'research' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}
            >
              Research
            </Button>
          </div>
        </div>
      </div>

      {/* Library Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.size}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    window.location.href = `/dashboard/summarize?id=${item.id}`;
                  }}
                >
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/dashboard/summarize?id=${item.id}`);
                    toast({
                      title: 'Link copied',
                      description: 'Summary link copied to clipboard',
                      variant: 'success',
                    });
                  }}
                >
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this summary?')) {
                      try {
                        const response = await fetch(`/api/summarize/${item.id}`, {
                          method: 'DELETE',
                        });
                        
                        if (!response.ok) {
                          throw new Error('Failed to delete summary');
                        }
                        
                        refetch();
                        toast({
                          title: 'Summary deleted',
                          description: 'The summary has been deleted successfully',
                          variant: 'success',
                        });
                      } catch (error) {
                        toast({
                          title: 'Delete failed',
                          description: error.message || 'Failed to delete summary',
                          variant: 'destructive',
                        });
                      }
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading your library</h3>
          <p className="text-gray-600">Please wait while we fetch your documents</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading library</h3>
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={refetch} 
            className="mt-4 bg-gray-900 text-white hover:bg-gray-800"
            variant="default"
          >
            Try Again
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default LibraryPage;
