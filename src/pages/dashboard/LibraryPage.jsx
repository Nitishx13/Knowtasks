import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';
import { useRouter } from 'next/router';
// Removed PDFViewer import - using direct browser PDF viewing instead

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [libraryItems, setLibraryItems] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  const { user } = useAuth();
  const router = useRouter();

  // Check if user is mentor - only allow uploads in mentor routes
  const isMentor = typeof window !== 'undefined' && router.pathname.includes('/mentor') && localStorage.getItem('mentor_authenticated');

  const mockLibraryItems = useMemo(() => [
    {
      id: 1,
      title: 'JEE Physics - Mechanics Formulas',
      type: 'formula',
      category: 'Physics',
      examType: 'JEE Main/Advanced',
      chapter: 'Mechanics',
      date: '2024-01-15',
      size: '45 formulas',
      status: 'completed',
      difficulty: 'High',
      tags: ['IIT-JEE', 'Mechanics', 'Motion', 'Forces']
    },
    {
      id: 2,
      title: 'NEET Organic Chemistry Reactions',
      type: 'formula',
      category: 'Chemistry',
      examType: 'NEET',
      chapter: 'Organic Chemistry',
      date: '2024-01-12',
      size: '38 formulas',
      status: 'in-progress',
      difficulty: 'Medium',
      tags: ['NEET', 'Organic', 'Reactions', 'Mechanisms']
    },
    {
      id: 3,
      title: 'JEE Advanced Calculus & Limits',
      type: 'flashcard',
      category: 'Mathematics',
      examType: 'JEE Advanced',
      chapter: 'Calculus',
      date: '2024-01-10',
      size: '52 cards',
      status: 'completed',
      difficulty: 'High',
      tags: ['JEE Advanced', 'Calculus', 'Limits', 'Derivatives']
    },
    {
      id: 4,
      title: 'NEET Biology - Human Physiology',
      type: 'flashcard',
      category: 'Biology',
      examType: 'NEET',
      chapter: 'Human Physiology',
      date: '2024-01-08',
      size: '67 cards',
      status: 'completed',
      difficulty: 'Medium',
      tags: ['NEET', 'Biology', 'Physiology', 'Human Body']
    },
    {
      id: 5,
      title: 'JEE Main 2023 Physics Paper',
      type: 'pyq',
      category: 'Physics',
      examType: 'JEE Main',
      year: '2023',
      date: '2024-01-05',
      size: '30 questions',
      status: 'completed',
      difficulty: 'Medium',
      tags: ['JEE Main', 'Physics', '2023', 'Previous Year']
    },
    {
      id: 6,
      title: 'NEET 2023 Chemistry Solutions',
      type: 'pyq',
      category: 'Chemistry',
      examType: 'NEET',
      year: '2023',
      date: '2024-01-03',
      size: '45 questions',
      status: 'in-progress',
      difficulty: 'Medium',
      tags: ['NEET', 'Chemistry', '2023', 'Solutions']
    },
    {
      id: 7,
      title: 'JEE Advanced Coordinate Geometry',
      type: 'notes',
      category: 'Mathematics',
      examType: 'JEE Advanced',
      chapter: 'Coordinate Geometry',
      date: '2024-01-01',
      size: 'Complete Notes',
      status: 'completed',
      difficulty: 'High',
      tags: ['JEE Advanced', 'Mathematics', 'Coordinate Geometry']
    },
    {
      id: 8,
      title: 'NEET Plant Kingdom Classification',
      type: 'notes',
      category: 'Biology',
      examType: 'NEET',
      chapter: 'Plant Kingdom',
      date: '2023-12-28',
      size: 'Detailed Notes',
      status: 'completed',
      difficulty: 'Medium',
      tags: ['NEET', 'Biology', 'Plant Kingdom', 'Classification']
    }
  ], []);

  // Function to fetch library items from unified API
  const fetchLibraryItems = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      
      // Fetch from unified library API that includes user content + shared mentor content
      const response = await fetch('/api/library', {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.library && Array.isArray(data.library)) {
        const items = data.library.map(item => ({
          id: `${item.content_type || 'user'}-${item.id}`,
          title: item.title,
          type: item.content_type === 'mentor_formula' ? 'formula' :
                item.content_type === 'mentor_flashcard' ? 'flashcard' :
                item.content_type === 'mentor_pyq' ? 'pyq' :
                item.document_type?.toLowerCase() || 'notes',
          category: item.category || 'General',
          subject: item.subject || item.category || 'General',
          date: new Date(item.created_at).toLocaleDateString(),
          size: item.content_type?.startsWith('mentor_') ? 
                (item.content_type === 'mentor_formula' ? 'Formula PDF' :
                 item.content_type === 'mentor_flashcard' ? 'Flashcard Set' :
                 item.content_type === 'mentor_pyq' ? 'Question Set' : 'Content') :
                `${item.word_count || 0} words`,
          status: 'completed',
          description: item.content || item.description || '',
          fileUrl: item.content_type?.startsWith('mentor_') ? 
                   `/api/uploads/serve-pdf-by-id?id=${item.id}` : 
                   item.file_url,
          fileName: item.file_name,
          uploadedBy: item.content_type?.startsWith('mentor_') ? 'mentor' : 'user',
          year: item.year,
          examType: item.exam_type,
          tags: item.tags || [],
          created_at: item.created_at,
          content_type: item.content_type,
          mentor_name: item.mentor_name,
          difficulty: item.content_type?.startsWith('mentor_') ? 'High' : 'Medium'
        }));
        
        console.log('Library stats:', data.stats);
        console.log('Processed library items:', items);
        console.log('Mentor items:', items.filter(item => item.uploadedBy === 'mentor'));
        setLibraryItems(items);
      } else {
        console.error('Failed to fetch library items:', data.error || 'Invalid response format');
        // No fallback to mock data - show empty state instead
        setLibraryItems([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading library items from API:', error);
      // No fallback to mock data - show empty state instead
      setLibraryItems([]);
      setLoading(false);
    }
  }, [activeTab, searchQuery, mockLibraryItems]);

  // Call fetchLibraryItems when component mounts or filters change
  useEffect(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);


  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Subject filtering
    const matchesSubject = subjectFilter === 'all' || 
                          (item.subject && item.subject.toLowerCase() === subjectFilter.toLowerCase()) ||
                          (item.category && item.category.toLowerCase() === subjectFilter.toLowerCase());
    
    // Handle filtering logic
    if (activeTab === 'all') {
      return matchesSearch && matchesSubject;
    } else if (activeTab === 'user') {
      return matchesSearch && matchesSubject && item.uploadedBy === 'user';
    } else if (activeTab === 'mentor') {
      return matchesSearch && matchesSubject && item.uploadedBy === 'mentor';
    } else {
      // Filter by content type (formula, flashcard, pyq, notes)
      return matchesSearch && matchesSubject && item.type === activeTab;
    }
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
      case 'notes':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">📚 Your Personal Library</h1>
            <p className="text-gray-600 text-base md:text-lg">Access your uploaded content plus high-quality study materials shared by expert mentors. All your learning resources in one place.</p>
          </div>
        </div>
        
        {/* IIT/NEET Focus Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">🎯 IIT-JEE</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">🏥 NEET</span>
              </div>
              <span className="text-gray-600 text-sm">Competitive Exam Focused Content</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Study Smart, Score High</p>
              <p className="text-xs text-gray-500">Curated for competitive success</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-6 md:mb-8">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search formulas, notes, PYQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Content Type Filters */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Content Type</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setActiveTab('all')}
                variant={activeTab === 'all' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'all' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                📚 All Content
              </Button>
              <Button 
                onClick={() => setActiveTab('formula')}
                variant={activeTab === 'formula' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'formula' ? 'bg-green-600 text-white hover:bg-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                🧮 Formula Bank
              </Button>
              <Button 
                onClick={() => setActiveTab('flashcard')}
                variant={activeTab === 'flashcard' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'flashcard' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                🃏 Flashcards
              </Button>
              <Button 
                onClick={() => setActiveTab('pyq')}
                variant={activeTab === 'pyq' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'pyq' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                📝 Previous Year Questions
              </Button>
              <Button 
                onClick={() => setActiveTab('notes')}
                variant={activeTab === 'notes' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'notes' ? 'bg-orange-600 text-white hover:bg-orange-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                📖 Study Notes
              </Button>
            </div>
          </div>
          
          {/* Content Source Filters */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Content Source</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setActiveTab('all')}
                variant={activeTab === 'all' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'all' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                🌟 All Sources
              </Button>
              <Button 
                onClick={() => setActiveTab('user')}
                variant={activeTab === 'user' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'user' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                📝 My Content
              </Button>
              <Button 
                onClick={() => setActiveTab('mentor')}
                variant={activeTab === 'mentor' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${activeTab === 'mentor' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                👨‍🏫 Expert Mentor Content
              </Button>
            </div>
          </div>
          
          {/* Subject Filters */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Subjects</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setSubjectFilter('all')}
                variant={subjectFilter === 'all' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${subjectFilter === 'all' ? 'bg-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                🌟 All Subjects
              </Button>
              <Button 
                onClick={() => setSubjectFilter('physics')}
                variant={subjectFilter === 'physics' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${subjectFilter === 'physics' ? 'bg-red-600 text-white hover:bg-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                ⚛️ Physics
              </Button>
              <Button 
                onClick={() => setSubjectFilter('chemistry')}
                variant={subjectFilter === 'chemistry' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${subjectFilter === 'chemistry' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                🧪 Chemistry
              </Button>
              <Button 
                onClick={() => setSubjectFilter('mathematics')}
                variant={subjectFilter === 'mathematics' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${subjectFilter === 'mathematics' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                📊 Mathematics
              </Button>
              <Button 
                onClick={() => setSubjectFilter('biology')}
                variant={subjectFilter === 'biology' ? 'default' : 'outline'}
                className={`text-xs md:text-sm px-3 py-1.5 ${subjectFilter === 'biology' ? 'bg-green-600 text-white hover:bg-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                🧬 Biology
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Filter Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing <strong>{filteredItems.length}</strong> of <strong>{libraryItems.length}</strong> items
            </span>
            {activeTab !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Filter: {activeTab === 'user' ? 'My Content' : 
                        activeTab === 'mentor' ? 'Mentor Content' :
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            )}
            {subjectFilter !== 'all' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Subject: {subjectFilter.charAt(0).toUpperCase() + subjectFilter.slice(1)}
              </span>
            )}
          </div>
          {(activeTab !== 'all' || subjectFilter !== 'all') && (
            <button 
              onClick={() => {
                setActiveTab('all');
                setSubjectFilter('all');
                setSearchQuery('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Special Header for Mentor Content Filter */}
      {activeTab === 'mentor' && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">👨‍🏫 Expert Mentor Content</h2>
              <p className="text-gray-600">High-quality study materials curated by experienced mentors</p>
            </div>
          </div>
        </div>
      )}

      {/* Library Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? `No results found for "${searchQuery}"` : 
               activeTab !== 'all' ? `No ${activeTab} content available` :
               'No content available with current filters'}
            </p>
            <button 
              onClick={() => {
                setActiveTab('all');
                setSubjectFilter('all');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters to see all content
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-blue-300">
            <div className="flex flex-col gap-4">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    
                    {/* Exam Type and Chapter */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Mentor Badge */}
                      {item.uploadedBy === 'mentor' && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold rounded-full border border-purple-200">
                          👨‍🏫 Mentor Content
                        </span>
                      )}
                      {item.uploadedBy === 'user' && (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
                          📝 My Content
                        </span>
                      )}
                      {item.examType && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          item.examType.includes('JEE') 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {item.examType.includes('JEE') ? '🎯' : '🏥'} {item.examType}
                        </span>
                      )}
                      {item.chapter && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                          📚 {item.chapter}
                        </span>
                      )}
                      {item.difficulty && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          item.difficulty === 'High' 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : item.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {item.difficulty === 'High' ? '🔥' : item.difficulty === 'Medium' ? '⚡' : '✨'} {item.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Subject and Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className={`flex items-center gap-1 font-medium ${
                        item.category === 'Physics' ? 'text-red-600' :
                        item.category === 'Chemistry' ? 'text-blue-600' :
                        item.category === 'Mathematics' ? 'text-purple-600' :
                        item.category === 'Biology' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {item.category === 'Physics' ? '⚛️' :
                         item.category === 'Chemistry' ? '🧪' :
                         item.category === 'Mathematics' ? '📊' :
                         item.category === 'Biology' ? '🧬' : '📖'} {item.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{item.size}</span>
                      <span className="text-gray-400">•</span>
                      <span>{item.date}</span>
                      {item.year && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium">{item.year}</span>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 4).map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded border">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 4 && (
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded border">
                            +{item.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(item.status)}`}>
                  {item.status === 'completed' ? '✅' : '🔄'} {item.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handleViewPDF(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Content
                  </Button>
                  <Button 
                    onClick={() => handleDownloadPDF(item)}
                    variant="outline" 
                    className="text-gray-700 border-gray-300 hover:bg-gray-50 text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-2"
                    title="Add to favorites"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-2"
                    title="Share"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
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
              <iframe
                src={selectedPDF.fileUrl}
                className="w-full h-full border-0"
                title={selectedPDF.fileName || 'PDF Document'}
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
