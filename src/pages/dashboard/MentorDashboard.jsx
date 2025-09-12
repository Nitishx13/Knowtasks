import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import PDFViewer from '../../components/ui/PDFViewer';
import FlashcardUploadModal from '../../components/ui/FlashcardUploadModal';
import PyqUploadModal from '../../components/ui/PyqUploadModal';

const MentorDashboard = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Physics',
    subject: 'Physics',
    tags: []
  });
  const [flashcardForm, setFlashcardForm] = useState({
    title: '',
    description: '',
    category: 'Biology',
    subject: 'Biology'
  });
  const [pyqForm, setPyqForm] = useState({
    title: '',
    description: '',
    category: 'Physics',
    subject: 'Physics',
    year: new Date().getFullYear(),
    examType: 'Midterm'
  });
  const [formulaBankItems, setFormulaBankItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('formula_bank_items');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [flashcardItems, setFlashcardItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flashcard_items');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [pyqItems, setPyqItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pyq_items');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showPyqModal, setShowPyqModal] = useState(false);
  const [activeSection, setActiveSection] = useState('formula');

  // Initialize with mock data if localStorage is empty
  const initializeMockData = () => {
    if (formulaBankItems.length === 0) {
      const mockFormulas = [
        {
          id: 1,
          title: 'Physics Formulas - Mechanics',
          description: 'Essential mechanics formulas for physics',
          category: 'Physics',
          subject: 'Physics',
          file_name: 'physics_mechanics.pdf',
          created_at: new Date().toISOString(),
          tags: ['mechanics', 'physics']
        },
        {
          id: 2,
          title: 'Mathematics - Calculus',
          description: 'Calculus formulas and derivatives',
          category: 'Mathematics',
          subject: 'Mathematics',
          file_name: 'math_calculus.pdf',
          created_at: new Date().toISOString(),
          tags: ['calculus', 'derivatives']
        }
      ];
      setFormulaBankItems(mockFormulas);
      localStorage.setItem('formula_bank_items', JSON.stringify(mockFormulas));
    }

    if (flashcardItems.length === 0) {
      const mockFlashcards = [
        {
          id: 1,
          title: 'Biology Cell Structure',
          description: 'Flashcards for cell biology',
          category: 'Biology',
          subject: 'Biology',
          file_name: 'biology_cells.pdf',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Chemistry Periodic Table',
          description: 'Element properties flashcards',
          category: 'Chemistry',
          subject: 'Chemistry',
          file_name: 'chemistry_periodic.pdf',
          created_at: new Date().toISOString()
        }
      ];
      setFlashcardItems(mockFlashcards);
      localStorage.setItem('flashcard_items', JSON.stringify(mockFlashcards));
    }

    if (pyqItems.length === 0) {
      const mockPyq = [
        {
          id: 1,
          title: 'Physics Midterm 2023',
          description: 'Previous year physics midterm paper',
          category: 'Physics',
          subject: 'Physics',
          year: 2023,
          exam_type: 'Midterm',
          file_name: 'physics_midterm_2023.pdf',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Mathematics Final 2023',
          description: 'Previous year mathematics final exam',
          category: 'Mathematics',
          subject: 'Mathematics',
          year: 2023,
          exam_type: 'Final',
          file_name: 'math_final_2023.pdf',
          created_at: new Date().toISOString()
        }
      ];
      setPyqItems(mockPyq);
      localStorage.setItem('pyq_items', JSON.stringify(mockPyq));
    }
  };

  useEffect(() => {
    initializeMockData();
  }, []);

  // Upload Formula Bank PDF
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!e.target.file.files[0]) return;

    setUploading(true);
    
    if (editingItem && editingItem.type === 'formula') {
      // Update existing item
      const updatedItems = formulaBankItems.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              title: uploadForm.title,
              description: uploadForm.description,
              category: uploadForm.category,
              subject: uploadForm.subject,
              tags: uploadForm.tags || []
            }
          : item
      );
      setFormulaBankItems(updatedItems);
      localStorage.setItem('formula_bank_items', JSON.stringify(updatedItems));
      setEditingItem(null);
      alert('Formula Bank item updated successfully!');
    } else {
      // Create new formula item
      const newItem = {
        id: Date.now(),
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        subject: uploadForm.subject,
        file_name: e.target.file.files[0].name,
        created_at: new Date().toISOString(),
        tags: uploadForm.tags || []
      };

      // Add to local state and localStorage
      const updatedItems = [...formulaBankItems, newItem];
      setFormulaBankItems(updatedItems);
      localStorage.setItem('formula_bank_items', JSON.stringify(updatedItems));
      alert('Formula Bank PDF uploaded successfully!');
    }

    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      category: 'Physics',
      subject: 'Physics',
      tags: []
    });
    setUploading(false);
  };

  // Upload Flashcard
  const handleFlashcardUpload = async (e) => {
    e.preventDefault();
    if (!e.target.file.files[0]) return;

    setUploading(true);
    
    if (editingItem && editingItem.type === 'flashcard') {
      // Update existing item
      const updatedItems = flashcardItems.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              title: flashcardForm.title,
              description: flashcardForm.description,
              category: flashcardForm.category,
              subject: flashcardForm.subject
            }
          : item
      );
      setFlashcardItems(updatedItems);
      localStorage.setItem('flashcard_items', JSON.stringify(updatedItems));
      setEditingItem(null);
      alert('Flashcard updated successfully!');
    } else {
      // Create new flashcard item
      const newItem = {
        id: Date.now(),
        title: flashcardForm.title,
        description: flashcardForm.description,
        category: flashcardForm.category,
        subject: flashcardForm.subject,
        file_name: e.target.file.files[0].name,
        created_at: new Date().toISOString()
      };

      // Add to local state and localStorage
      const updatedItems = [...flashcardItems, newItem];
      setFlashcardItems(updatedItems);
      localStorage.setItem('flashcard_items', JSON.stringify(updatedItems));
      alert('Flashcard uploaded successfully!');
    }

    setShowFlashcardModal(false);
    setFlashcardForm({
      title: '',
      description: '',
      category: 'Biology',
      subject: 'Biology'
    });
    setUploading(false);
  };

  // Upload PYQ
  const handlePyqUpload = async (e) => {
    e.preventDefault();
    if (!e.target.file.files[0]) return;

    setUploading(true);
    
    if (editingItem && editingItem.type === 'pyq') {
      // Update existing item
      const updatedItems = pyqItems.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              title: pyqForm.title,
              description: pyqForm.description,
              category: pyqForm.category,
              subject: pyqForm.subject,
              year: pyqForm.year,
              exam_type: pyqForm.examType
            }
          : item
      );
      setPyqItems(updatedItems);
      localStorage.setItem('pyq_items', JSON.stringify(updatedItems));
      setEditingItem(null);
      alert('PYQ updated successfully!');
    } else {
      // Create new PYQ item
      const newItem = {
        id: Date.now(),
        title: pyqForm.title,
        description: pyqForm.description,
        category: pyqForm.category,
        subject: pyqForm.subject,
        year: pyqForm.year,
        exam_type: pyqForm.examType,
        file_name: e.target.file.files[0].name,
        created_at: new Date().toISOString()
      };

      // Add to local state and localStorage
      const updatedItems = [...pyqItems, newItem];
      setPyqItems(updatedItems);
      localStorage.setItem('pyq_items', JSON.stringify(updatedItems));
      alert('PYQ uploaded successfully!');
    }

    setShowPyqModal(false);
    setPyqForm({
      title: '',
      description: '',
      category: 'Physics',
      subject: 'Physics',
      year: new Date().getFullYear(),
      examType: 'Midterm'
    });
    setUploading(false);
  };

  // Handle PDF viewing
  const handleViewPDF = (item) => {
    setSelectedPDF(item);
    setShowPDFModal(true);
  };

  // Handle PDF download
  const handleDownloadPDF = (item) => {
    // Create download link
    const link = document.createElement('a');
    link.href = item.file_url || `/uploads/${encodeURIComponent(item.file_name || item.fileName)}`;
    link.download = item.file_name || item.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // State for editing
  const [editingItem, setEditingItem] = useState(null);

  // Handle Edit Item
  const handleEditItem = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'formula') {
      setUploadForm({
        title: item.title,
        description: item.description,
        category: item.category,
        subject: item.subject,
        tags: item.tags || []
      });
      setShowUploadModal(true);
    } else if (type === 'flashcard') {
      setFlashcardForm({
        title: item.title,
        description: item.description,
        category: item.category,
        subject: item.subject
      });
      setShowFlashcardModal(true);
    } else if (type === 'pyq') {
      setPyqForm({
        title: item.title,
        description: item.description,
        category: item.category,
        subject: item.subject,
        year: item.year,
        examType: item.exam_type
      });
      setShowPyqModal(true);
    }
  };

  // Handle Delete Item
  const handleDeleteItem = async (itemId, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    // Remove from local state and localStorage
    if (type === 'formula') {
      const updatedItems = formulaBankItems.filter(item => item.id !== itemId);
      setFormulaBankItems(updatedItems);
      localStorage.setItem('formula_bank_items', JSON.stringify(updatedItems));
    } else if (type === 'flashcard') {
      const updatedItems = flashcardItems.filter(item => item.id !== itemId);
      setFlashcardItems(updatedItems);
      localStorage.setItem('flashcard_items', JSON.stringify(updatedItems));
    } else if (type === 'pyq') {
      const updatedItems = pyqItems.filter(item => item.id !== itemId);
      setPyqItems(updatedItems);
      localStorage.setItem('pyq_items', JSON.stringify(updatedItems));
    }
    alert('Item deleted successfully!');
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Hey there 👋</h1>
        <p className="text-gray-400 text-base md:text-lg">Welcome back to your Mentor dashboard</p>
      </div>

      {/* Content Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Formula Bank */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Formula Bank</h3>
            <p className="text-blue-100 mb-4 text-sm">Upload PDF formulas</p>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 text-sm font-semibold"
            >
              Upload PDF
            </Button>
          </div>
        </div>

        {/* Flashcards */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Flashcards</h3>
            <p className="text-green-100 mb-4 text-sm">Upload study cards</p>
            <Button 
              onClick={() => setShowFlashcardModal(true)}
              className="bg-white text-green-700 hover:bg-green-50 px-4 py-2 text-sm font-semibold"
            >
              Upload Card
            </Button>
          </div>
        </div>

        {/* PYQ */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">PYQ</h3>
            <p className="text-purple-100 mb-4 text-sm">Upload question papers</p>
            <Button 
              onClick={() => setShowPyqModal(true)}
              className="bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 text-sm font-semibold"
            >
              Upload PYQ
            </Button>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 mb-8">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveSection('formula')}
            className={`px-6 py-4 font-medium ${activeSection === 'formula' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            Formula Bank ({formulaBankItems.length})
          </button>
          <button
            onClick={() => setActiveSection('flashcard')}
            className={`px-6 py-4 font-medium ${activeSection === 'flashcard' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            Flashcards ({flashcardItems.length})
          </button>
          <button
            onClick={() => setActiveSection('pyq')}
            className={`px-6 py-4 font-medium ${activeSection === 'pyq' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            PYQ ({pyqItems.length})
          </button>
        </div>

        {/* Content Display */}
        <div className="p-6">
          {activeSection === 'formula' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-gray-400 mt-2">Loading Formula Bank items...</p>
                </div>
              ) : formulaBankItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 mb-4">No Formula Bank PDFs uploaded yet</p>
                  <Button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Upload Your First PDF
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formulaBankItems.map((item) => (
                    <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                            <p className="text-xs text-gray-400">{item.category}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {new Date(item.created_at || item.uploadedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewPDF(item)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(item)}
                            className="text-gray-400 hover:text-white"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handleEditItem(item, 'formula')}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id, 'formula')}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'flashcard' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-gray-400 mt-2">Loading Flashcards...</p>
                </div>
              ) : flashcardItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-400 mb-4">No Flashcards uploaded yet</p>
                  <Button 
                    onClick={() => setShowFlashcardModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    Upload Your First Flashcard
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flashcardItems.map((item) => (
                    <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                            <p className="text-xs text-gray-400">{item.category}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewPDF(item)}
                            className="text-green-400 hover:text-green-300"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(item)}
                            className="text-gray-400 hover:text-white"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handleEditItem(item, 'flashcard')}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id, 'flashcard')}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'pyq' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-gray-400 mt-2">Loading PYQ...</p>
                </div>
              ) : pyqItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 mb-4">No PYQ uploaded yet</p>
                  <Button 
                    onClick={() => setShowPyqModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  >
                    Upload Your First PYQ
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pyqItems.map((item) => (
                    <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <svg className="w-8 h-8 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                            <p className="text-xs text-gray-400">{item.category} • {item.year} • {item.exam_type}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewPDF(item)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(item)}
                            className="text-gray-400 hover:text-white"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handleEditItem(item, 'pyq')}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id, 'pyq')}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
                  placeholder="Enter description"
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
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload PDF'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flashcard Upload Modal */}
      <FlashcardUploadModal
        show={showFlashcardModal}
        onClose={() => setShowFlashcardModal(false)}
        onSubmit={handleFlashcardUpload}
        uploading={uploading}
        form={flashcardForm}
        setForm={setFlashcardForm}
      />

      {/* PYQ Upload Modal */}
      <PyqUploadModal
        show={showPyqModal}
        onClose={() => setShowPyqModal(false)}
        onSubmit={handlePyqUpload}
        uploading={uploading}
        form={pyqForm}
        setForm={setPyqForm}
      />

      {/* PDF Viewer Modal */}
      {showPDFModal && selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">{selectedPDF.title}</h2>
              <button
                onClick={() => setShowPDFModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PDFViewer 
                fileUrl={`/api/uploads/${encodeURIComponent(selectedPDF.file_name || selectedPDF.fileName)}`}
                fileName={selectedPDF.file_name || selectedPDF.fileName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorDashboard;
