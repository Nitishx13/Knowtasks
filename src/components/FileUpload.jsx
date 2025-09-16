import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUploadCloud, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAuthHeaders } from '../utils/auth';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!user || !user.id) {
      setError('You must be logged in to upload files.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Get auth headers
      const headers = await getAuthHeaders(user.id);
      
      // Add user ID directly to FormData as fallback
      formData.append('userId', user.id);
      
      console.log('Uploading file with user ID:', user.id);
      
      // Remove Content-Type from headers as it's set automatically with FormData
      const { 'Content-Type': contentType, ...authHeaders } = headers;
      
      const response = await fetch('/api/data/upload', {
        method: 'POST',
        body: formData,
        headers: authHeaders
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        setFile(null);
        
        // Call the success callback if provided
        if (onUploadSuccess && typeof onUploadSuccess === 'function') {
          onUploadSuccess(data.file);
        }
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        
        let errorMessage = errorData.error || 'Upload failed';
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        
        setError(errorMessage);
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center">
        <div className="w-full">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF, TXT, DOC up to 10MB</p>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">{file.name}</span>
                <span className="ml-2 text-sm text-gray-500">({formatFileSize(file.size)})</span>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <FiAlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;