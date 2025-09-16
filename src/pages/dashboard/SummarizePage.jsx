import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const SummarizePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'text', 'notes', 'formula', 'concept'
  const [textInput, setTextInput] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [noteType, setNoteType] = useState('general'); // 'general', 'formula', 'concept', 'question'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [chapter, setChapter] = useState('');
  const [tags, setTags] = useState([]);
  const [formulaData, setFormulaData] = useState({ name: '', formula: '', description: '', applications: '' });
  const [conceptData, setConceptData] = useState({ title: '', description: '', keyPoints: '', examples: '' });
  const [noteData, setNoteData] = useState({ title: '', content: '', tags: '' });
  const [savedNotes, setSavedNotes] = useState([]);
  const [savedFormulas, setSavedFormulas] = useState([]);
  const [savedConcepts, setSavedConcepts] = useState([]);
  const { user } = useAuth();

  // Function to fetch saved data
  const fetchSavedData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const authHeaders = await getAuthHeaders(user.id);
      
      // Fetch notes, formulas, and concepts in parallel
      const [notesRes, formulasRes, conceptsRes] = await Promise.all([
        fetch('/api/notes/get', { headers: authHeaders }),
        fetch('/api/formulas/get', { headers: authHeaders }),
        fetch('/api/concepts/get', { headers: authHeaders })
      ]);
      
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setSavedNotes(notesData.notes || []);
      }
      
      if (formulasRes.ok) {
        const formulasData = await formulasRes.json();
        setSavedFormulas(formulasData.formulas || []);
      }
      
      if (conceptsRes.ok) {
        const conceptsData = await conceptsRes.json();
        setSavedConcepts(conceptsData.concepts || []);
      }
    } catch (error) {
      console.error('Error fetching saved data:', error);
    }
  }, [user?.id]);

  // Function to fetch text files
  const fetchTextFiles = useCallback(async () => {
    setLoading(true);
    try {
      // Include user ID in the request to get user-specific files
      const userId = user?.id;
      const headers = await getAuthHeaders(userId);
      const response = await fetch(`/api/text/list${userId ? `?userId=${userId}` : ''}`, {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        // Combine text files with summaries
        const textFiles = data.files.map(file => ({
          id: file.id,
          fileName: file.title,
          summary: file.summary,
          wordCount: file.wordCount,
          formattedSize: `${Math.ceil(file.content.length / 1024)} KB`,
          formattedDate: file.formattedDate,
          fileType: 'text'
        }));
        
        // Add text files to summaries
        setSummaries(prevSummaries => [...prevSummaries, ...textFiles]);
      }
    } catch (error) {
      console.error('Error fetching text files:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSummaries = useCallback(async () => {
    setLoading(true);
    try {
      const userId = user?.id;
      const headers = await getAuthHeaders(userId);
      const response = await fetch('/api/summarize/list', {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setSummaries(data.summaries || []);
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch existing summaries and text files on component mount
  useEffect(() => {
    fetchSummaries();
    fetchSavedData();
  }, [fetchSummaries, fetchSavedData]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const userId = user?.id;
      const headers = await getAuthHeaders(userId);
      // Remove Content-Type header as it will be set automatically for FormData
      delete headers['Content-Type'];
      
      const response = await fetch('/api/summarize/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        setResult(data);
        
        // Refresh summaries list
        await fetchSummaries();
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        
        // Create a detailed error message with all available information
        let errorMessage = errorData.error || 'Upload failed';
        
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        
        if (errorData.code) {
          errorMessage += ` (Code: ${errorData.code})`;
        }
        
        console.log('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // New function to handle text processing
  const handleProcessText = async () => {
    if (!textInput.trim()) {
      setError('Please enter some text to process.');
      return;
    }

    setIsProcessingText(true);
    setError(null);
    
    try {
      // First, get the summary from the summarize API
      const userId = user?.id;
      const headers = await getAuthHeaders(userId);
      
      const summaryResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: textInput }),
      });
      
      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(errorData.error || 'Text processing failed');
      }
      
      const summaryData = await summaryResponse.json();
      console.log('Text processing successful:', summaryData);
      
      // Then, save the text file with the summary and user ID
      const authHeaders = await getAuthHeaders(user?.id);
      const saveResponse = await fetch('/api/text/save', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ 
          text: textInput,
          title: 'Text Notes',
          summary: summaryData.summary,
          subject: selectedSubject,
          chapter,
          difficulty,
          noteType
        }),
      });
      
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('Text file saving failed:', errorData);
        throw new Error(errorData.error || 'Failed to save text file');
      }
      
      const savedData = await saveResponse.json();
      console.log('Text file saved successfully:', savedData);
      
      setResult({
        fileName: savedData.title,
        fileSize: textInput.length,
        fileType: 'text',
        content: textInput,
        summary: summaryData.summary,
        wordCount: Math.ceil(summaryData.summary.split(' ').length),
        date: new Date().toISOString(),
        fileId: savedData.fileId
      });
      
      // Refresh summaries list and saved data
      await fetchSummaries();
      await fetchSavedData();
    } catch (error) {
      console.error('Text processing error:', error);
      setError(error.message || 'Text processing failed');
    } finally {
      setIsProcessingText(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveFormula = async () => {
    if (!formulaData.name || !formulaData.formula) {
      setError('Please provide both formula name and expression');
      return;
    }

    try {
      const authHeaders = await getAuthHeaders(user?.id);
      console.log('Auth headers for formula save:', authHeaders);
      
      const response = await fetch('/api/formulas/save', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          ...formulaData,
          subject: selectedSubject,
          chapter,
          difficulty,
          userId: user?.id
        }),
      });

      const responseData = await response.json();
      console.log('Formula save response:', responseData);

      if (response.ok) {
        // Reset form
        setFormulaData({ name: '', formula: '', description: '', applications: '' });
        setChapter('');
        alert(`Formula saved to ${selectedSubject} bank successfully!`);
        // Refresh saved data
        fetchSavedData();
      } else {
        console.error('Formula save failed:', responseData);
        throw new Error(responseData.error || responseData.message || 'Failed to save formula');
      }
    } catch (error) {
      console.error('Error saving formula:', error);
      setError('Failed to save formula. Please try again.');
    }
  };

  const handleSaveConcept = async () => {
    if (!conceptData.title || !conceptData.description) {
      setError('Please provide both concept title and description');
      return;
    }

    try {
      const authHeaders = await getAuthHeaders(user?.id);
      console.log('Auth headers for concept save:', authHeaders);
      
      const response = await fetch('/api/concepts/save', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          ...conceptData,
          subject: selectedSubject,
          chapter,
          difficulty,
          userId: user?.id
        }),
      });

      const responseData = await response.json();
      console.log('Concept save response:', responseData);

      if (response.ok) {
        // Reset form
        setConceptData({ title: '', description: '', keyPoints: '', examples: '' });
        setChapter('');
        alert(`Concept map saved for ${selectedSubject} successfully!`);
        // Refresh saved data
        fetchSavedData();
      } else {
        console.error('Concept save failed:', responseData);
        throw new Error(responseData.error || responseData.message || 'Failed to save concept');
      }
    } catch (error) {
      console.error('Error saving concept:', error);
      setError('Failed to save concept. Please try again.');
    }
  };

  const handleSaveNote = async () => {
    if (!noteData.title || !noteData.content) {
      setError('Please provide both note title and content');
      return;
    }

    try {
      const authHeaders = await getAuthHeaders(user?.id);
      console.log('Auth headers for note save:', authHeaders);
      
      const response = await fetch('/api/notes/save', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          ...noteData,
          subject: selectedSubject,
          chapter,
          difficulty,
          noteType,
          tags: noteData.tags ? noteData.tags.split(',').map(tag => tag.trim()) : [],
          userId: user?.id
        }),
      });

      const responseData = await response.json();
      console.log('Note save response:', responseData);

      if (response.ok) {
        // Reset form
        setNoteData({ title: '', content: '', tags: '' });
        setChapter('');
        alert(`Note saved to ${selectedSubject} successfully!`);
        // Refresh saved data
        fetchSavedData();
      } else {
        console.error('Note save failed:', responseData);
        throw new Error(responseData.error || responseData.message || 'Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-gray-900">Upload Notes</h1>
          <p className="text-gray-600 text-base md:text-lg">
            Advanced note-taking system for NEET & IIT preparation - Upload, organize, and master your study materials
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Link 
            href="/dashboard/library" 
            className="inline-flex w-full md:w-auto justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            View Knowledge Hub
          </Link>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Select Subject</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subject) => (
              <button
                key={subject}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedSubject === subject
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {subject === 'Physics' && '⚛️'}
                    {subject === 'Chemistry' && '🧪'}
                    {subject === 'Mathematics' && '📐'}
                    {subject === 'Biology' && '🧬'}
                  </div>
                  <div className="text-sm font-medium">{subject}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upload')}
          >
            📄 Upload File
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('text')}
          >
            ✍️ Write Notes
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'formula' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('formula')}
          >
            🧮 Add Formula
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'concept' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('concept')}
          >
            💡 Concept Map
          </button>
        </div>

        {/* File Upload Section */}
        {activeTab === 'upload' && (
          <div className="space-y-3 md:space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-1 md:space-y-2">
                  <svg className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-xs md:text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">{selectedSubject} materials: PDF, TXT, DOC, DOCX up to 50MB</p>
                </div>
              </label>
            </div>
            
            {file && (
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs md:text-sm font-medium text-gray-900 truncate">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{formatFileSize(file.size)}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full px-4 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm md:text-base"
            >
              {isUploading ? 'Processing...' : 'Upload & Analyze'}
            </button>
          </div>
        )}

        {/* Enhanced Text Input Section */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* Note Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter/Topic</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g., Thermodynamics, Organic Chemistry"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">🟢 Easy (Basic Concepts)</option>
                  <option value="medium">🟡 Medium (JEE Main Level)</option>
                  <option value="hard">🔴 Hard (JEE Advanced/NEET)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">📝 General Notes</option>
                  <option value="formula">🧮 Formula & Derivation</option>
                  <option value="concept">💡 Key Concept</option>
                  <option value="question">❓ Practice Question</option>
                  <option value="trick">⚡ Shortcut/Trick</option>
                </select>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Write your ${selectedSubject} notes here...\n\nTips for better organization:\n• Use clear headings and subheadings\n• Include formulas with proper notation\n• Add examples and practice problems\n• Mention important concepts and definitions`}
                className="w-full h-48 md:h-64 p-3 md:p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
            
            <button
              onClick={handleProcessText}
              disabled={!textInput.trim() || isProcessingText}
              className="w-full px-4 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm md:text-base"
            >
              {isProcessingText ? 'Processing & Organizing...' : `📚 Save ${selectedSubject} Notes`}
            </button>
          </div>
        )}


        {/* Formula Input Section */}
        {activeTab === 'formula' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🧮 Add Formula for {selectedSubject}</h4>
              <p className="text-sm text-blue-600">Create a comprehensive formula entry with derivations and applications</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formula Name</label>
                <input
                  type="text"
                  value={formulaData.name}
                  onChange={(e) => setFormulaData({...formulaData, name: e.target.value})}
                  placeholder="e.g., Newton's Second Law, Ideal Gas Law"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="Chapter or topic name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formula Expression</label>
              <textarea
                value={formulaData.formula}
                onChange={(e) => setFormulaData({...formulaData, formula: e.target.value})}
                placeholder="Write the formula using standard notation\ne.g., F = ma, PV = nRT, E = mc²"
                className="w-full h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description & Derivation</label>
              <textarea
                value={formulaData.description}
                onChange={(e) => setFormulaData({...formulaData, description: e.target.value})}
                placeholder="Explain the formula, its derivation, and when to use it..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applications & Examples</label>
              <textarea
                value={formulaData.applications}
                onChange={(e) => setFormulaData({...formulaData, applications: e.target.value})}
                placeholder="List practical applications, example problems, and tips for remembering..."
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => handleSaveFormula()}
              disabled={!formulaData.name || !formulaData.formula}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              🧮 Save Formula to {selectedSubject} Bank
            </button>
          </div>
        )}

        {/* Concept Map Section */}
        {activeTab === 'concept' && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">💡 Create Concept Map for {selectedSubject}</h4>
              <p className="text-sm text-purple-600">Build interconnected concept maps to visualize relationships between topics</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Concept Title</label>
              <input
                type="text"
                value={conceptData.title}
                onChange={(e) => setConceptData({...conceptData, title: e.target.value})}
                placeholder="e.g., Electromagnetic Induction, Chemical Bonding"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Core Description</label>
              <textarea
                value={conceptData.description}
                onChange={(e) => setConceptData({...conceptData, description: e.target.value})}
                placeholder="Explain the fundamental concept in simple terms..."
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Points & Sub-concepts</label>
              <textarea
                value={conceptData.keyPoints}
                onChange={(e) => setConceptData({...conceptData, keyPoints: e.target.value})}
                placeholder="• List important points\n• Related sub-concepts\n• Prerequisites\n• Common misconceptions"
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examples & Applications</label>
              <textarea
                value={conceptData.examples}
                onChange={(e) => setConceptData({...conceptData, examples: e.target.value})}
                placeholder="Real-world examples, practice problems, and applications..."
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => handleSaveConcept()}
              disabled={!conceptData.title || !conceptData.description}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              💡 Save Concept Map
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6 text-xs md:text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Summary Result</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="overflow-hidden">
                <span className="text-blue-600 font-medium">Source:</span> <span className="truncate inline-block">{result.fileName}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Words:</span> {result.wordCount}
              </div>
              <div>
                <span className="text-blue-600 font-medium">Size:</span> {formatFileSize(result.fileSize)}
              </div>
              <div>
                <span className="text-blue-600 font-medium">Type:</span> {result.fileType}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Summary</h3>
              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">{result.summary}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Content Preview</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                {result.content.length > 300 ? result.content.substring(0, 300) + '...' : result.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Data Display */}
      {(savedNotes.length > 0 || savedFormulas.length > 0 || savedConcepts.length > 0) && (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">📚 Your Saved Study Materials</h2>
          
          {/* Saved Notes */}
          {savedNotes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-blue-700 mb-3">✍️ Notes ({savedNotes.length})</h3>
              <div className="space-y-3">
                {savedNotes.map((note) => (
                  <div key={note.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-blue-900">{note.title}</h4>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{note.subject}</span>
                    </div>
                    <p className="text-sm text-blue-800 mb-2">{note.summary || note.content.substring(0, 150)}...</p>
                    <div className="flex justify-between text-xs text-blue-600">
                      <span>{note.chapter && `Chapter: ${note.chapter}`}</span>
                      <span>{note.difficulty} • {note.word_count} words</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Formulas */}
          {savedFormulas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-green-700 mb-3">🧮 Formulas ({savedFormulas.length})</h3>
              <div className="space-y-3">
                {savedFormulas.map((formula) => (
                  <div key={formula.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-green-900">{formula.name}</h4>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{formula.subject}</span>
                    </div>
                    <div className="bg-white p-2 rounded border font-mono text-sm mb-2">{formula.formula}</div>
                    <p className="text-sm text-green-800 mb-2">{formula.description}</p>
                    <div className="flex justify-between text-xs text-green-600">
                      <span>{formula.chapter && `Chapter: ${formula.chapter}`}</span>
                      <span>{formula.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Concepts */}
          {savedConcepts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-purple-700 mb-3">💡 Concepts ({savedConcepts.length})</h3>
              <div className="space-y-3">
                {savedConcepts.map((concept) => (
                  <div key={concept.id} className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-purple-900">{concept.title}</h4>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">{concept.subject}</span>
                    </div>
                    <p className="text-sm text-purple-800 mb-2">{concept.description}</p>
                    {concept.key_points && (
                      <div className="text-sm text-purple-700 mb-2">
                        <strong>Key Points:</strong> {concept.key_points.substring(0, 100)}...
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-purple-600">
                      <span>{concept.chapter && `Chapter: ${concept.chapter}`}</span>
                      <span>{concept.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Intelligence Hub */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold">🧠 Intelligence Hub</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">AI Processing Active</span>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-6 md:py-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping"></div>
            </div>
            <p className="mt-2 text-xs md:text-sm text-gray-600">Scanning knowledge repository...</p>
          </div>
        ) : summaries.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-700">📊 Knowledge Analytics</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {summaries.length} documents processed
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Intelligence extraction complete • Pattern recognition active • Cross-referencing enabled
              </p>
            </div>
            
            {summaries.map((summary) => (
              <div key={summary.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">{summary.fileName}</h4>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-600">Processed</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border-l-2 border-blue-300 mb-2">
                      <p className="text-gray-700 text-xs md:text-sm line-clamp-2 italic">
                        &quot;{summary.summary && summary.summary.length > 120 
                          ? summary.summary.substring(0, 120) + '...' 
                          : summary.summary || 'Intelligence extraction in progress...'}&quot;
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <span>📝</span>
                        <span>{summary.wordCount || 0} words</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>💾</span>
                        <span>{summary.formattedSize}</span>
                      </span>
                      <span className="hidden sm:flex items-center space-x-1">
                        <span>📅</span>
                        <span>{summary.formattedDate}</span>
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                        {summary.fileType?.replace('.', '') || 'document'}
                      </span>
                    </div>
                  </div>
                  {summary.fileType === 'text' && (
                    <a 
                      href={`/dashboard/files?id=${summary.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all duration-200 ml-2 flex-shrink-0 shadow-sm"
                    >
                      🔍 Analyze
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-purple-700">🎯 Intelligence Insights</span>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                  View Analytics →
                </button>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Cross-document patterns detected • Knowledge gaps identified • Study recommendations ready
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <div className="relative mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">🚀 Intelligence Engine Ready</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-4 max-w-md mx-auto">
              Your personal AI study assistant is waiting to process documents, extract key insights, and build your intelligent knowledge base for NEET & IIT preparation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-500 max-w-lg mx-auto">
              <div className="flex items-center justify-center space-x-1 p-2 bg-blue-50 rounded">
                <span>🔍</span>
                <span>Smart Analysis</span>
              </div>
              <div className="flex items-center justify-center space-x-1 p-2 bg-green-50 rounded">
                <span>🧠</span>
                <span>Pattern Recognition</span>
              </div>
              <div className="flex items-center justify-center space-x-1 p-2 bg-purple-50 rounded">
                <span>📊</span>
                <span>Knowledge Mapping</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizePage;
