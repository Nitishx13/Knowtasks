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
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'text', 'formula', 'concept'
  const [textInput, setTextInput] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [noteType, setNoteType] = useState('general'); // 'general', 'formula', 'concept', 'question'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [chapter, setChapter] = useState('');
  const [tags, setTags] = useState([]);
  const [formulaData, setFormulaData] = useState({ name: '', formula: '', description: '', applications: '' });
  const [conceptData, setConceptData] = useState({ title: '', description: '', keyPoints: '', examples: '' });
  const { user } = useAuth();

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
    fetchTextFiles();
  }, [fetchSummaries, fetchTextFiles]);

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
      const saveResponse = await fetch(`/api/text/save${userId ? `?userId=${userId}` : ''}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          text: textInput,
          title: 'Text Input',
          summary: summaryData.summary
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
      
      // Refresh summaries list
      await fetchSummaries();
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
      const response = await fetch('/api/formulas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formulaData,
          subject: selectedSubject,
          chapter,
          difficulty,
          userId: user?.id
        }),
      });

      if (response.ok) {
        // Reset form
        setFormulaData({ name: '', formula: '', description: '', applications: '' });
        setChapter('');
        alert(`Formula saved to ${selectedSubject} bank successfully!`);
      } else {
        throw new Error('Failed to save formula');
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
      const response = await fetch('/api/concepts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...conceptData,
          subject: selectedSubject,
          chapter,
          difficulty,
          userId: user?.id
        }),
      });

      if (response.ok) {
        // Reset form
        setConceptData({ title: '', description: '', keyPoints: '', examples: '' });
        setChapter('');
        alert(`Concept map saved for ${selectedSubject} successfully!`);
      } else {
        throw new Error('Failed to save concept');
      }
    } catch (error) {
      console.error('Error saving concept:', error);
      setError('Failed to save concept. Please try again.');
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

      {/* Previous Summaries and Text Files */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Your Processed Documents</h2>
        
        {loading ? (
          <div className="text-center py-6 md:py-8">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-xs md:text-sm text-gray-600">Loading summaries...</p>
          </div>
        ) : summaries.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {summaries.map((summary) => (
              <div key={summary.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base truncate">{summary.fileName}</h4>
                    <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">
                      {summary.summary && summary.summary.length > 150 
                        ? summary.summary.substring(0, 150) + '...' 
                        : summary.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-gray-500">
                      <span>{summary.wordCount || 0} words</span>
                      <span>{summary.formattedSize}</span>
                      <span className="hidden sm:inline">{summary.formattedDate}</span>
                      <span className="capitalize">{summary.fileType?.replace('.', '') || 'unknown'}</span>
                    </div>
                  </div>
                  {summary.fileType === 'text' && (
                    <a 
                      href={`/dashboard/files?id=${summary.id}`}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-full hover:border-blue-400 ml-2 flex-shrink-0"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8">
            <svg className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-900">No summaries yet</h3>
            <p className="mt-1 text-xs md:text-sm text-gray-500">
              Upload study materials or paste content above to start building your knowledge base.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizePage;
