import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';
import { useRouter } from 'next/router';
import PDFViewer from '../../components/ui/PDFViewer';

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [libraryItems, setLibraryItems] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // Check if user is mentor - only allow uploads in mentor routes
  const isMentor = typeof window !== 'undefined' && router.pathname.includes('/mentor') && localStorage.getItem('mentor_authenticated');

  const mockLibraryItems = [
    {
      id: 1,
      title: 'Physics Equations',
      type: 'formula',
      category: 'Physics',
      date: '2023-11-15',
      size: '25 formulas',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Organic Chemistry Reactions',
      type: 'formula',
      category: 'Chemistry',
      date: '2023-11-10',
      size: '18 formulas',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Calculus Fundamentals',
      type: 'flashcard',
      category: 'Mathematics',
      date: '2023-11-08',
      size: '32 cards',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Computer Science Concepts',
      type: 'flashcard',
      category: 'CS',
      date: '2023-11-05',
      size: '21 cards',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Physics 2022 Exam',
      type: 'pyq',
      category: 'Physics',
      date: '2023-11-03',
      size: '15 questions',
      status: 'completed'
    },
    {
      id: 6,
      title: 'Mathematics 2021 Midterm',
      type: 'pyq',
      category: 'Mathematics',
      date: '2023-11-01',
      size: '10 questions',
      status: 'in-progress'
    }
  ];

  // Function to fetch library items from API
  const fetchLibraryItems = useCallback(async () => {
    setLoading(true);
    try {
      const allItems = [];

      // Fetch Formula Bank items
      try {
        const formulaResponse = await fetch('/api/formula-bank/list?' + new URLSearchParams({
          category: activeTab === 'formula' ? '' : '',
          search: searchQuery
        }));
        
        if (formulaResponse.ok) {
          const formulaData = await formulaResponse.json();
          const formulaItems = formulaData.data.map(item => ({
            id: `formula-${item.id}`,
            title: item.title,
            type: 'formula',
            category: item.subject,
            date: new Date(item.created_at).toLocaleDateString(),
            size: `${Math.round(item.file_size / 1024)} KB`,
            status: 'completed',
            description: item.description,
            fileUrl: `/api/uploads/${encodeURIComponent(item.file_name)}`,
            fileName: item.file_name,
            uploadedBy: item.uploaded_by,
            tags: item.tags || [],
            created_at: item.created_at
          }));
          allItems.push(...formulaItems);
        }
      } catch (error) {
        console.error('Error fetching formula bank items:', error);
      }

      // Fetch Flashcards
      try {
        const flashcardResponse = await fetch('/api/flashcards/list?' + new URLSearchParams({
          category: activeTab === 'flashcard' ? '' : '',
          search: searchQuery
        }));
        
        if (flashcardResponse.ok) {
          const flashcardData = await flashcardResponse.json();
          const flashcardItems = flashcardData.data.map(item => ({
            id: `flashcard-${item.id}`,
            title: item.title,
            type: 'flashcard',
            category: item.subject,
            date: new Date(item.created_at).toLocaleDateString(),
            size: `${Math.round(item.file_size / 1024)} KB`,
            status: 'completed',
            description: item.description,
            fileUrl: `/api/uploads/${encodeURIComponent(item.file_name)}`,
            fileName: item.file_name,
            uploadedBy: item.uploaded_by,
            tags: item.tags || [],
            created_at: item.created_at
          }));
          allItems.push(...flashcardItems);
        }
      } catch (error) {
        console.error('Error fetching flashcard items:', error);
      }

      // Fetch PYQ items
      try {
        const pyqResponse = await fetch('/api/pyq/list?' + new URLSearchParams({
          category: activeTab === 'pyq' ? '' : '',
          search: searchQuery
        }));
        
        if (pyqResponse.ok) {
          const pyqData = await pyqResponse.json();
          const pyqItems = pyqData.data.map(item => ({
            id: `pyq-${item.id}`,
            title: item.title,
            type: 'pyq',
            category: item.subject,
            date: new Date(item.created_at).toLocaleDateString(),
            size: `${Math.round(item.file_size / 1024)} KB`,
            status: 'completed',
            description: item.description,
            fileUrl: `/api/uploads/${encodeURIComponent(item.file_name)}`,
            fileName: item.file_name,
            uploadedBy: item.uploaded_by,
            year: item.year,
            examType: item.exam_type,
            tags: item.tags || [],
            created_at: item.created_at
          }));
          allItems.push(...pyqItems);
        }
      } catch (error) {
        console.error('Error fetching PYQ items:', error);
      }

      // Sort items by creation date (newest first)
      allItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setLibraryItems(allItems.length > 0 ? allItems : mockLibraryItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching library items:', error);
      // Fallback to mock data
      setLibraryItems(mockLibraryItems);
      setLoading(false);
    }
  }, [activeTab, searchQuery, mockLibraryItems]);

  // Call fetchLibraryItems when component mounts or filters change
  useEffect(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);


  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  // Handle PDF viewing
  const handleViewPDF = (item) => {
    setSelectedPDF(item);
    setShowPDFModal(true);
  };

  // Handle PDF download
  const handleDownloadPDF = (item) => {
    const link = document.createElement('a');
    link.href = item.fileUrl || `/uploads/${encodeURIComponent(item.fileName)}`;
    link.download = item.fileName || item.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      case 'formula':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
          </svg>
        );
      case 'flashcard':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'pyq':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Knowledge Hub</h1>
        <p className="text-gray-600 text-base md:text-lg">Access your Formula Bank, Flashcards, and Previous Year Questions</p>
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
              onClick={() => setActiveTab('formula')}
              variant={activeTab === 'formula' ? 'default' : 'outline'}
              className={`text-xs md:text-sm px-3 py-1.5 md:py-2 ${activeTab === 'formula' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              Formula Bank
            </Button>
            <Button 
              onClick={() => setActiveTab('flashcard')}
              variant={activeTab === 'flashcard' ? 'default' : 'outline'}
              className={`text-xs md:text-sm px-3 py-1.5 md:py-2 ${activeTab === 'flashcard' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              Flashcards
            </Button>
            <Button 
              onClick={() => setActiveTab('pyq')}
              variant={activeTab === 'pyq' ? 'default' : 'outline'}
              className={`text-xs md:text-sm px-3 py-1.5 md:py-2 ${activeTab === 'pyq' ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              PYQ
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
                    {item.type === 'pyq' && item.year && (
                      <span className="text-xs md:text-sm text-gray-500">{item.year}</span>
                    )}
                    {item.type === 'pyq' && item.examType && (
                      <span className="text-xs md:text-sm text-gray-500">{item.examType}</span>
                    )}
                    <span className="text-xs md:text-sm text-gray-500">{item.size}</span>
                    <span className="text-xs md:text-sm text-gray-500">{item.date}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button 
                  onClick={() => handleViewPDF(item)}
                  variant="outline" 
                  size="sm" 
                  className="text-xs md:text-sm px-2 md:px-3 py-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  View
                </Button>
                <Button 
                  onClick={() => handleDownloadPDF(item)}
                  variant="outline" 
                  size="sm" 
                  className="text-xs md:text-sm px-2 md:px-3 py-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Download
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

      {/* PDF Viewer Modal */}
      {showPDFModal && selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedPDF.title}</h2>
                <p className="text-sm text-gray-600">{selectedPDF.category}</p>
              </div>
              <button
                onClick={() => setShowPDFModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-4">
              <PDFViewer
                fileUrl={selectedPDF.fileUrl}
                fileName={selectedPDF.fileName}
                onError={(error) => {
                  console.error('PDF load error:', error);
                }}
              />
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p><strong>Description:</strong> {selectedPDF.description}</p>
                <p><strong>Uploaded:</strong> {new Date(selectedPDF.created_at || selectedPDF.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownloadPDF(selectedPDF)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Download PDF
                </Button>
                <Button
                  onClick={() => setShowPDFModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
