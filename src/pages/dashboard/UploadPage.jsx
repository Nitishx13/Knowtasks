import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import FileUpload from '../../components/FileUpload';
import TextUpload from '../../components/TextUpload';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { getAuthHeaders } from '../../utils/auth';

const UploadPage = () => {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [recentUploads, setRecentUploads] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const { user } = useAuth();

  const fetchRecentUploads = useCallback(async () => {
    try {
      // Get auth headers
      const headers = await getAuthHeaders(user.id);
      
      // Fetch recent file uploads
      const filesResponse = await fetch(`/api/data/files?userId=${user.id}&limit=5`, {
        headers
      });
      const filesData = await filesResponse.json();
      
      // Fetch recent text uploads
      const textResponse = await fetch(`/api/data/text-files?userId=${user.id}&limit=5`, {
        headers
      });
      const textData = await textResponse.json();
      
      // Combine and sort by upload date
      const allUploads = [
        ...(filesData.success ? filesData.files.map(file => ({
          ...file,
          type: 'file'
        })) : []),
        ...(textData.success ? textData.files.map(file => ({
          ...file,
          type: 'text'
        })) : [])
      ];
      
      // Sort by upload date (newest first)
      allUploads.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      // Take only the 5 most recent uploads
      setRecentUploads(allUploads.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchRecentUploads();
    }
  }, [user, fetchRecentUploads]);

  const handleUploadSuccess = (file) => {
    setUploadSuccess({
      message: `${file.fileName || file.title} uploaded successfully!`,
      timestamp: new Date()
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setUploadSuccess(null);
    }, 5000);
    
    // Refresh recent uploads
    fetchRecentUploads();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-gray-900">Upload Content</h1>
        <p className="text-gray-600 text-base md:text-lg">
          Upload files or save text content to your personal dashboard
        </p>
      </div>

      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 rounded-md">
          <div className="flex">
            <FiCheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-700">{uploadSuccess.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 px-4 py-3 font-medium text-sm ${activeTab === 'file' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('file')}
              >
                <FiUploadCloud className="inline-block mr-2" />
                Upload File
              </button>
              <button
                className={`flex-1 px-4 py-3 font-medium text-sm ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('text')}
              >
                <FiFileText className="inline-block mr-2" />
                Save Text
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'file' ? (
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              ) : (
                <TextUpload onUploadSuccess={handleUploadSuccess} />
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h2>
            
            {recentUploads.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentUploads.map((upload) => (
                  <li key={upload.id} className="py-3">
                    <div className="flex items-center">
                      {upload.type === 'file' ? (
                        <FiUploadCloud className="h-5 w-5 text-gray-400 mr-2" />
                      ) : (
                        <FiFileText className="h-5 w-5 text-gray-400 mr-2" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {upload.fileName || upload.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(upload.uploadDate)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recent uploads</p>
            )}
            
            <div className="mt-4">
              <Link 
                href="/dashboard" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all uploads
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;