import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
// Removed PDFViewer import - using direct browser PDF viewing instead

const MentorDashboardSimple = () => {
  const [activeSection, setActiveSection] = useState('formula');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // State for different content types
  const [formulaItems, setFormulaItems] = useState([]);
  const [flashcardItems, setFlashcardItems] = useState([]);
  const [pyqItems, setPyqItems] = useState([]);
  const [notesItems, setNotesItems] = useState([]);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Physics',
    subject: 'Physics',
    year: new Date().getFullYear(),
    examType: 'Midterm'
  });

  // Fetch content from server (display only)
  const fetchContent = async (type) => {
    try {
      const response = await fetch(`/api/uploads/get-mentor-content?type=${type}`);
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
    fetchContent('formula');
    fetchContent('flashcard');
    fetchContent('pyq');
    fetchContent('notes');
  }, []);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!e.target.file.files[0]) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', e.target.file.files[0]);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('subject', uploadForm.subject);
      formData.append('type', activeSection);
      
      if (activeSection === 'pyq') {
        formData.append('year', uploadForm.year);
        formData.append('examType', uploadForm.examType);
      }

      const response = await fetch('/api/uploads/mentor-content', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        await fetchContent(activeSection);
        alert(`${getSectionTitle(activeSection)} uploaded successfully!`);
        setShowUploadModal(false);
        resetForm();
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
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

  // Handle PDF viewing
  const handleViewPDF = (item) => {
    // Use ID-based API endpoint to serve PDF files
    const pdfUrl = `/api/uploads/serve-pdf-by-id?id=${item.id}`;
    window.open(pdfUrl, '_blank');
  };

  // Handle PDF download
  const handleDownloadPDF = (item) => {
    const link = document.createElement('a');
    link.href = `/api/uploads/serve-pdf-by-id?id=${item.id}`;
    link.download = `${item.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      const response = await fetch('/api/uploads/update-mentor-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
        const response = await fetch('/api/uploads/delete-mentor-content', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
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

  const getSectionTitle = (section) => {
    switch (section) {
      case 'formula': return 'Formula Bank';
      case 'flashcard': return 'Flashcards';
      case 'pyq': return 'Previous Year Questions';
      case 'notes': return 'Notes';
      default: return 'Content';
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Mentor Content Upload</h1>
          <p className="text-gray-400 text-center">Upload and manage your educational content</p>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Formula Bank */}
          <div 
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('formula');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-xl font-bold mb-2">Formula Bank</h3>
              <p className="text-blue-200 text-sm mb-4">Upload mathematical formulas and equations</p>
              <div className="bg-blue-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>

          {/* Flashcards */}
          <div 
            className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('flashcard');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-xl font-bold mb-2">Flashcards</h3>
              <p className="text-green-200 text-sm mb-4">Create interactive study flashcards</p>
              <div className="bg-green-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>

          {/* Previous Year Questions */}
          <div 
            className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => {
              setActiveSection('pyq');
              setShowUploadModal(true);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Previous Year Questions</h3>
              <p className="text-purple-200 text-sm mb-4">Upload past exam questions and papers</p>
              <div className="bg-purple-500/30 rounded-lg p-2">
                <span className="text-sm font-medium">Click to Upload</span>
              </div>
            </div>
          </div>

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
        </div>

        {/* Content Display */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Uploaded Content</h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['formula', 'flashcard', 'pyq', 'notes'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section
                    ? 'bg-blue-600 text-white'
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
