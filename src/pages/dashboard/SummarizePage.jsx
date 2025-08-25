import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { summarizeService } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useUploadThing } from '@uploadthing/react';
import { generateComponents } from '@uploadthing/react';

const { UploadButton } = generateComponents();

const SummarizePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setUploadedFile({
          url: res[0].url,
          name: res[0].name
        });
        setUploadProgress(100);
      }
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    },
  });

  const handleFileUpload = async (files) => {
    if (files && files.length > 0) {
      setUploadProgress(0);
      await startUpload(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert('Please upload a PDF file first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await summarizeService.uploadAndSummarize(
        uploadedFile.url, 
        uploadedFile.name
      );
      
      if (response && response.success) {
        setSummary({
          ...response.summary,
          date: new Date(response.summary.date).toLocaleDateString()
        });
      } else {
        throw new Error(response.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      alert(`Error: ${error.message || 'Failed to generate summary'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSummary(null);
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">PDF Summarizer</h1>
        <p className="text-gray-600 text-base md:text-lg">Upload a PDF document to generate an AI-powered summary</p>
      </div>

      {!summary ? (
        <div className="max-w-2xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload PDF Document</h2>
              <p className="text-gray-600">Select a PDF file to analyze and summarize</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <UploadButton
                  endpoint="pdfUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setUploadedFile({
                        url: res[0].url,
                        name: res[0].name
                      });
                      setUploadProgress(100);
                    }
                  }}
                  onUploadProgress={(progress) => {
                    setUploadProgress(progress);
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    alert('Upload failed. Please try again.');
                  }}
                  className="w-full"
                >
                  {({ ready, isUploading, uploadProgress }) => (
                    <div className="cursor-pointer">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                        ) : (
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium mb-2">
                        {uploadedFile ? uploadedFile.name : 'Click to upload PDF'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {uploadedFile ? 'File uploaded successfully' : 'or drag and drop your PDF here'}
                      </p>
                      {isUploading && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </UploadButton>
              </div>

              {/* File Info */}
              {uploadedFile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={!uploadedFile || isLoading || isUploading}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Summary...
                  </div>
                ) : (
                  'Generate Summary'
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">What you'll get:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Key Points</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Concise Summary</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Fast Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Summary Results */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Summary Header */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Summary Generated</h2>
                  <p className="text-sm text-gray-500">Document: {summary.fileName}</p>
                </div>
              </div>
              <Button onClick={resetForm} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Upload New PDF
              </Button>
            </div>
          </div>

          {/* Summary Content */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Summary</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {summary.content}
              </p>
              
              {summary.keyPoints && summary.keyPoints.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Key Points:</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Document Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Word Count</p>
                    <p className="font-medium text-gray-900">{summary.wordCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Document Type</p>
                    <p className="font-medium text-gray-900">{summary.documentType || 'PDF'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Pages</p>
                    <p className="font-medium text-gray-900">{summary.estimatedPages || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Generated</p>
                    <p className="font-medium text-gray-900">{summary.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gray-900 text-white hover:bg-gray-800">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Summary
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Summary
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save to Library
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-8 mt-8">
        <p>🤖 Powered by Knowtasks AI</p>
      </div>
    </DashboardLayout>
  );
};

export default SummarizePage;