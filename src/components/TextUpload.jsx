import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getAuthHeaders } from '../utils/auth';

const TextUpload = ({ onUploadSuccess }) => {
  const [textInput, setTextInput] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setError(null);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleProcessText = async () => {
    if (!textInput.trim()) {
      setError('Please enter some text to process.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your text.');
      return;
    }

    if (!user || !user.id) {
      setError('You must be logged in to save text.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Get auth headers
      const headers = await getAuthHeaders(user.id);
      
      // Save the text file with user ID
      const response = await fetch('/api/data/text-files/save', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          text: textInput,
          title: title,
          userId: user.id
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Text saved successfully:', data);
        
        // Reset form
        setTextInput('');
        setTitle('');
        
        // Call the success callback if provided
        if (onUploadSuccess && typeof onUploadSuccess === 'function') {
          onUploadSuccess(data.file);
        }
      } else {
        const errorData = await response.json();
        console.error('Text saving failed:', errorData);
        
        let errorMessage = errorData.error || 'Failed to save text';
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Text processing error:', error);
      setError(error.message || 'Text processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col">
        <div className="mb-4">
          <label htmlFor="text-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="text-title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a title for your text"
            value={title}
            onChange={handleTitleChange}
            disabled={isProcessing}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            id="text-content"
            rows="8"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter or paste your text here"
            value={textInput}
            onChange={handleTextChange}
            disabled={isProcessing}
          ></textarea>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <FiAlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleProcessText}
            disabled={!textInput.trim() || !title.trim() || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Save Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextUpload;