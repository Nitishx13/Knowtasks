import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const SummarizePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'text'
  const [textInput, setTextInput] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);
  const { user } = useAuth();

  // Fetch existing summaries and text files on component mount
  useEffect(() => {
    fetchSummaries();
    fetchTextFiles();
  }, []);
  
  // Function to fetch text files
  const fetchTextFiles = async () => {
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
  };

  const fetchSummaries = async () => {
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
  };

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

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-gray-900">Document Upload & Processing</h1>
          <p className="text-gray-600 text-base md:text-lg">
            Upload study materials, research papers, and documents for AI-powered summarization and knowledge extraction
          </p>
        </div>
        <div className="w-full md:w-auto">
          <a 
            href="/dashboard/library" 
            className="inline-flex w-full md:w-auto justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            View Knowledge Hub
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload File
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('text')}
          >
            Paste Text
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
                  <p className="text-xs text-gray-500">Study materials: PDF, TXT, DOC, DOCX up to 50MB</p>
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

        {/* Text Input Section */}
        {activeTab === 'text' && (
          <div className="space-y-3 md:space-y-4">
            <div className="border border-gray-300 rounded-lg">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste lecture notes, research content, or study material here for AI analysis..."
                className="w-full h-48 md:h-64 p-3 md:p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
            
            <button
              onClick={handleProcessText}
              disabled={!textInput.trim() || isProcessingText}
              className="w-full px-4 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm md:text-base"
            >
              {isProcessingText ? 'Analyzing...' : 'Analyze & Summarize'}
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
