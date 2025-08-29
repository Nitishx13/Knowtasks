import React, { useState, useEffect } from 'react';

const SummarizePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing summaries on component mount
  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/summarize/list');
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
      
      const response = await fetch('/api/summarize/upload', {
        method: 'POST',
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
        setError(errorData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Smart Summarization Tool</h1>
        <p className="text-gray-600 text-lg">
          Upload PDFs and documents to generate intelligent summaries
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.doc,.docx"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-500">PDF, TXT, DOC, DOCX up to 50MB</p>
              </div>
            </label>
          </div>
          
          {file && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                </div>
                <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isUploading ? 'Processing...' : 'Upload & Summarize'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Result</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">File:</span> {result.fileName}
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
              <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{result.summary}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Content Preview</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {result.content.length > 300 ? result.content.substring(0, 300) + '...' : result.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Previous Summaries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Previous Summaries</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading summaries...</p>
          </div>
        ) : summaries.length > 0 ? (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <div key={summary.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{summary.fileName}</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {summary.summary && summary.summary.length > 150 
                        ? summary.summary.substring(0, 150) + '...' 
                        : summary.summary}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{summary.wordCount || 0} words</span>
                      <span>{summary.formattedSize}</span>
                      <span>{summary.formattedDate}</span>
                      <span className="capitalize">{summary.fileType?.replace('.', '') || 'unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No summaries yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload a document above to generate your first summary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizePage;
