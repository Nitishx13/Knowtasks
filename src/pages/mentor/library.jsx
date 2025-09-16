import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';

const MentorLibraryPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [libraryItems, setLibraryItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Physics',
    subject: 'Physics',
    tags: []
  });
  
  const router = useRouter();

  // Function to fetch library items from API
  const fetchLibraryItems = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch Formula Bank items from database
      const response = await fetch('/api/formula-bank/list?' + new URLSearchParams({
        category: activeTab === 'all' ? '' : activeTab,
        search: searchQuery
      }));
      
      if (response.ok) {
        const data = await response.json();
        const formattedItems = data.data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'formula',
          category: item.subject,
          date: new Date(item.created_at).toLocaleDateString(),
          size: `${Math.round(item.file_size / 1024)} KB`,
          status: 'completed',
          description: item.description,
          fileUrl: item.file_url,
          uploadedBy: item.uploaded_by,
          tags: item.tags || []
        }));
        setLibraryItems(formattedItems);
      } else {
        // Fallback to mock data if API fails
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
          }
        ];
        setLibraryItems(mockLibraryItems);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching library items:', error);
      // Fallback to mock data
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
        }
      ];
      setLibraryItems(mockLibraryItems);
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchLibraryItems();
  }, [fetchLibraryItems]);

  // Upload Formula Bank PDF
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!e.target.file.files[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.file.files[0]);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('subject', uploadForm.subject);
    formData.append('uploadedBy', 'mentor'); // In real app, get from auth
    formData.append('uploaderRole', 'mentor');
    formData.append('tags', JSON.stringify(uploadForm.tags));

    try {
      const response = await fetch('/api/formula-bank/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'Physics',
          subject: 'Physics',
          tags: []
        });
        fetchLibraryItems(); // Refresh the list
        alert('Formula Bank PDF uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
      case 'formula':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
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
      <div>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Formula Bank Library</h1>
          <p className="text-gray-600 text-base md:text-lg">Manage and upload Formula Bank PDFs for students</p>
        </div>

        {/* Search and Upload */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Formula Bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Formula Bank PDF
            </Button>
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
                    Download
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
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">No Formula Bank items found</h3>
            <p className="text-sm md:text-base text-gray-600">Upload your first Formula Bank PDF to get started</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upload Formula Bank PDF</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                  <input
                    type="file"
                    name="file"
                    accept=".pdf"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    placeholder="Enter formula bank title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    placeholder="Brief description of the formulas"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={uploadForm.subject}
                      onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {uploading ? 'Uploading...' : 'Upload PDF'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorLibraryPage;
