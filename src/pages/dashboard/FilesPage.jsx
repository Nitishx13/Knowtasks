import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (id && files.length > 0) {
      viewFile(id);
    }
  }, [id, files]);

  const fetchFiles = async () => {
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
        setFiles(data.files || []);
      } else {
        throw new Error('Failed to fetch files');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const viewFile = async (id) => {
    try {
      // Include user ID in the request to ensure user can only view their own files
      const userId = user?.id;
      const headers = await getAuthHeaders(userId);
      const response = await fetch(`/api/text/view?id=${id}${userId ? `&userId=${userId}` : ''}`, {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedFile(data.file);
      } else {
        throw new Error('Failed to fetch file details');
      }
    } catch (error) {
      console.error('Error viewing file:', error);
      setError(error.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Text Files</h1>
        <p className="text-gray-600 text-lg">
          View and manage your saved text files
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading files...</p>
              </div>
            ) : files.length > 0 ? (
              <div className="space-y-4">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedFile?.id === file.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => viewFile(file.id)}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{file.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{file.wordCount || 0} words</span>
                      <span>{file.formattedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No files yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Go to the Summarize page to create your first text file.
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/summarize">
                    <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      Create Text File
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Content */}
        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold">{selectedFile.title}</h2>
                </div>
                <span className="text-sm text-gray-500">{selectedFile.formattedDate}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{selectedFile.summary || 'No summary available'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Content</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedFile.content}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span>{selectedFile.wordCount} words</span>
                </div>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([selectedFile.content], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = `${selectedFile.title || 'text-file'}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No file selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a file from the list to view its content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;