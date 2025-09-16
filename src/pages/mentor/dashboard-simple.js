import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
// Removed PDFViewer import - using direct browser PDF viewing instead

const MentorDashboardSimple = () => {
  const [activeSection, setActiveSection] = useState('notes');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: null,
    name: 'Loading...',
    title: 'Educational Guide',
    email: null,
    experience: 0
  });

  // State for different content types
  const [formulaItems, setFormulaItems] = useState([]);
  const [flashcardItems, setFlashcardItems] = useState([]);
  const [pyqItems, setPyqItems] = useState([]);
  const [notesItems, setNotesItems] = useState([]);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'neet',
    subject: 'physics',
    year: new Date().getFullYear(),
    examType: 'neet'
  });

  // Get authenticated user ID from localStorage
  const getAuthenticatedUserId = () => {
    return localStorage.getItem('mentorUserId') || localStorage.getItem('userId');
  };

  // Get mentor data from localStorage (fallback method)
  const getMentorDataFromStorage = () => {
    try {
      const mentorData = localStorage.getItem('mentorData');
      if (mentorData) {
        return JSON.parse(mentorData);
      }
    } catch (error) {
      console.error('Error parsing mentor data from localStorage:', error);
    }
    return null;
  };

  // Load profile using multiple approaches
  const loadMentorProfile = async () => {
    const userId = getAuthenticatedUserId();
    
    // Method 1: Try to get data from localStorage first (immediate display)
    const storedMentorData = getMentorDataFromStorage();
    if (storedMentorData) {
      console.log('Using stored mentor data:', storedMentorData);
      setUserInfo({
        userId: storedMentorData.id || userId,
        name: storedMentorData.name || 'Mentor User',
        title: 'Educational Guide',
        email: storedMentorData.email || 'No email provided',
        experience: storedMentorData.experience || 0
      });
    }
    
    // Method 2: Try API call to get fresh data (if available)
    if (userId) {
      try {
        const response = await fetch('/api/mentor/profile', {
          headers: {
            'user-id': userId
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile API response:', data);
          
          if (data.success && data.mentor) {
            setUserInfo({
              userId: data.mentor.userId || data.mentor.id,
              name: data.mentor.name,
              title: 'Educational Guide',
              email: data.mentor.email,
              experience: data.mentor.experience || 0
            });
            return;
          }
        }
      } catch (error) {
        console.error('API call failed:', error);
      }
    }
    
    // Method 3: Fallback to basic user info if all else fails
    if (!storedMentorData) {
      setUserInfo({
        userId: userId || 'Unknown',
        name: 'Mentor User',
        title: 'Educational Guide', 
        email: 'Please update your profile',
        experience: 0
      });
    }
  };

  // Fetch content from server (display only)
  const fetchContent = async (type) => {
    try {
      const userId = getAuthenticatedUserId();
      if (!userId) {
        console.error('No authenticated user ID found for content fetch');
        return;
      }

      const response = await fetch(`/api/uploads/get-mentor-content?type=${type}`, {
        headers: {
          'user-id': userId
        }
      });
      const data = await response.json();
      if (data.success) {
        switch (type) {
          case 'formula':
            setFormulaItems(data.uploads);
            break;
          case 'flashcard':
            setFlashcardItems(data.uploads);
            break;
          case 'pyq':
            setPyqItems(data.uploads);
            break;
          case 'notes':
            setNotesItems(data.uploads);
            break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} items:`, error);
    }
  };

  useEffect(() => {
    loadMentorProfile();
    fetchContent('formula');
    fetchContent('flashcard');
    fetchContent('pyq');
    fetchContent('notes');
  }, []);

  // Handle file upload with improved authentication
  const handleUpload = async (e) => {
    e.preventDefault();
    console.log('Upload form submitted');
    
    const fileInput = e.target.file;
    const selectedFile = fileInput?.files[0];
    
    console.log('File input:', fileInput);
    console.log('Selected file:', selectedFile);
    
    if (!selectedFile) {
      alert('Please select a PDF file to upload');
      return;
    }
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      alert('Please select a PDF file only');
      return;
    }
    
    // Validate form data
    if (!uploadForm.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!uploadForm.description.trim()) {
      alert('Please enter a description');
      return;
    }

    setUploading(true);
    
    try {
      const userId = getAuthenticatedUserId();
      if (!userId) {
        alert('Authentication error: Please log in again');
        setUploading(false);
        return;
      }
      
      console.log('Creating FormData with:', {
        file: selectedFile.name,
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        subject: uploadForm.subject,
        type: activeSection,
        userId: userId
      });

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadForm.title.trim());
      formData.append('description', uploadForm.description.trim());
      formData.append('category', uploadForm.category);
      formData.append('subject', uploadForm.subject);
      formData.append('type', activeSection);
      
      if (activeSection === 'pyq') {
        formData.append('year', uploadForm.year);
        formData.append('examType', uploadForm.examType);
      }

      console.log('Sending upload request...');
      const response = await fetch('/api/uploads/mentor-content', {
        method: 'POST',
        headers: {
          'user-id': userId  // Simplified header for mentor authentication
        },
        body: formData
      });

      console.log('Upload response status:', response.status);
      const data = await response.json();
      console.log('Upload response data:', data);

      if (data.success) {
        console.log('Upload successful, refreshing content...');
        await fetchContent(activeSection);
        alert(`${getSectionTitle(activeSection)} uploaded successfully!`);
        setShowUploadModal(false);
        resetForm();
      } else {
        console.error('Upload failed:', data);
        alert('Upload failed: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setUploadForm({
      title: '',
      description: '',
      category: 'Physics',
      subject: 'Physics',
      year: new Date().getFullYear(),
      examType: 'Midterm'
    });
  };

  // Handle PDF viewing with authentication
  const handleViewPDF = async (item) => {
    const userId = getAuthenticatedUserId();
    if (!userId) {
      alert('Authentication required to view PDF');
      return;
    }
    
    try {
      // Fetch the PDF with authentication headers
      const response = await fetch(`/api/uploads/serve-pdf-by-id?id=${item.id}`, {
        headers: {
          'user-id': userId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load PDF');
      }
      
      // Create blob URL and open in new tab
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('View PDF error:', error);
      alert('Failed to view PDF');
    }
  };

  // Handle PDF download with authentication
  const handleDownloadPDF = async (item) => {
    const userId = getAuthenticatedUserId();
    if (!userId) {
      alert('Authentication required to download PDF');
      return;
    }
    
    try {
      const response = await fetch(`/api/uploads/serve-pdf-by-id?id=${item.id}`, {
        headers: {
          'user-id': userId
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setUploadForm({
      title: item.title,
      description: item.description,
      category: item.category,
      subject: item.subject,
      year: item.year || new Date().getFullYear(),
      examType: item.exam_type || 'Midterm'
    });
    setShowEditModal(true);
  };

  // Handle update item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    
    try {
      const userId = getAuthenticatedUserId();
      if (!userId) {
        alert('Authentication error: Please log in again');
        return;
      }

      const response = await fetch('/api/uploads/update-mentor-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token',
          'user-id': userId
        },
        body: JSON.stringify({
          id: editingItem.id,
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          subject: uploadForm.subject,
          year: uploadForm.year,
          examType: uploadForm.examType
        })
      });

      const data = await response.json();

      if (data.success) {
        await fetchContent(activeSection);
        alert('Content updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        resetForm();
      } else {
        alert('Update failed: ' + data.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed. Please try again.');
    }
  };

  // Handle delete item
  const handleDeleteItem = async (item) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const userId = getAuthenticatedUserId();
        if (!userId) {
          alert('Authentication error: Please log in again');
          return;
        }

        const response = await fetch('/api/uploads/delete-mentor-content', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token',
            'user-id': userId
          },
          body: JSON.stringify({ id: item.id })
        });

        const data = await response.json();

        if (data.success) {
          await fetchContent(activeSection);
          alert('Content deleted successfully!');
        } else {
          alert('Delete failed: ' + data.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Delete failed. Please try again.');
      }
    }
  };

  // Helper functions
  const getSectionTitle = (section) => {
    switch (section) {
      case 'formula': return 'Formula Bank';
      case 'flashcard': return 'Flashcards';
      case 'pyq': return 'Previous Year Questions';
      case 'notes': return 'Notes';
      default: return section;
    }
  };

  const getSectionColor = (section) => {
    switch (section) {
      case 'formula': return 'bg-blue-600 text-white';
      case 'flashcard': return 'bg-green-600 text-white';
      case 'pyq': return 'bg-purple-600 text-white';
      case 'notes': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getCurrentItems = () => {
    switch (activeSection) {
      case 'formula': return formulaItems;
      case 'flashcard': return flashcardItems;
      case 'pyq': return pyqItems;
      case 'notes': return notesItems;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* User Info Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Mentor Dashboard</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-300 text-sm">Welcome back, {userInfo.name}</p>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {userInfo.title}
                </span>
              </div>
              {userInfo.email && (
                <p className="text-gray-400 text-xs mt-1">{userInfo.email}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">User ID</p>
              <p className="text-yellow-400 font-mono text-sm">{userInfo.userId}</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Mentor Content Upload</h1>
          <p className="text-gray-400 text-center">Upload and manage your educational content</p>
        </div>

        {/* Upload Cards - All Content Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Notes */}
          <div 
            className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('notes');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Notes</h3>
              <p className="text-orange-200 text-sm mb-4">Upload study notes and materials</p>
              <div className="bg-orange-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div 
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('formula');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-xl font-bold mb-2">Formula</h3>
              <p className="text-blue-200 text-sm mb-4">Upload formula sheets and references</p>
              <div className="bg-blue-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>

          {/* Flashcard */}
          <div 
            className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('flashcard');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-xl font-bold mb-2">Flashcard</h3>
              <p className="text-green-200 text-sm mb-4">Upload flashcards and quick revision</p>
              <div className="bg-green-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>

          {/* PYQ */}
          <div 
            className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('pyq');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">PYQ</h3>
              <p className="text-purple-200 text-sm mb-4">Upload previous year questions</p>
              <div className="bg-purple-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Uploaded Content</h2>
          
          {/* Tabs - All Content Types */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['notes', 'formula', 'flashcard', 'pyq'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section
                    ? getSectionColor(section)
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {getSectionTitle(section)} ({getCurrentItems().length})
              </button>
            ))}
          </div>

          {/* Content List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentItems().length > 0 ? (
              getCurrentItems().map((item) => (
                <div key={item.id} className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>{item.subject}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewPDF(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(item)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm font-medium"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No {getSectionTitle(activeSection).toLowerCase()} uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Upload {getSectionTitle(activeSection)}</h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white h-20"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                {activeSection === 'pyq' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <input
                        type="number"
                        value={uploadForm.year}
                        onChange={(e) => setUploadForm({...uploadForm, year: parseInt(e.target.value)})}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                        min="2000"
                        max="2030"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Exam Type</label>
                      <select
                        value={uploadForm.examType}
                        onChange={(e) => setUploadForm({...uploadForm, examType: e.target.value})}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      >
                        <option value="Midterm">Midterm</option>
                        <option value="Final">Final</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Assignment">Assignment</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">PDF File</label>
                  <input
                    type="file"
                    name="file"
                    accept=".pdf"
                    required
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Edit {editingItem.title}</h2>
              
              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white h-20"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                    className="w-full p-3 bg-gray-700 rounded-lg text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                {activeSection === 'pyq' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <input
                        type="number"
                        value={uploadForm.year}
                        onChange={(e) => setUploadForm({...uploadForm, year: parseInt(e.target.value)})}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                        min="2000"
                        max="2030"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Exam Type</label>
                      <select
                        value={uploadForm.examType}
                        onChange={(e) => setUploadForm({...uploadForm, examType: e.target.value})}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      >
                        <option value="Midterm">Midterm</option>
                        <option value="Final">Final</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Assignment">Assignment</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MentorDashboardSimple;
