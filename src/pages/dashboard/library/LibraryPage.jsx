import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../hooks/use-toast';

const LibraryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await fetch('/api/library?userId=test-user');
      if (response.ok) {
        const data = await response.json();
        setSummaries(data.summaries || []);
      } else {
        throw new Error('Failed to fetch summaries');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load summaries from library.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Document Library</h1>
        <p className="text-gray-600 text-base md:text-lg">
          Your collection of AI-generated summaries and analyzed documents
        </p>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries yet</h3>
                        <p className="text-gray-500 mb-4">Upload your first document to get started</p>
              <Button onClick={() => window.location.href = '/dashboard/library'}>
                Upload Document
              </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summaries List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Documents ({summaries.length})</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {summaries.map((summary) => (
                  <div
                    key={summary.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSummary?.id === summary.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedSummary(summary)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {summary.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(summary.createdAt)}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {summary.documentType || 'Document'}
                          </span>
                          {summary.complexityLevel && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {summary.complexityLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Details */}
          <div className="lg:col-span-2">
            {selectedSummary ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedSummary.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Generated on {formatDate(selectedSummary.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Document Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedSummary.wordCount}</p>
                      <p className="text-xs text-gray-500">Words</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedSummary.estimatedPages}</p>
                      <p className="text-xs text-gray-500">Pages</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedSummary.fileSize ? formatFileSize(selectedSummary.fileSize) : 'N/A'}</p>
                      <p className="text-xs text-gray-500">File Size</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedSummary.keyPoints?.length || 0}</p>
                      <p className="text-xs text-gray-500">Key Points</p>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {(selectedSummary.writingStyle || selectedSummary.complexityLevel) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSummary.writingStyle && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">Writing Style</p>
                            <p className="text-blue-700">{selectedSummary.writingStyle}</p>
                          </div>
                        )}
                        {selectedSummary.complexityLevel && (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-900">Complexity Level</p>
                            <p className="text-green-700 capitalize">{selectedSummary.complexityLevel}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary Content */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedSummary.content}
                      </p>
                    </div>
                  </div>

                  {/* Key Points */}
                  {selectedSummary.keyPoints && selectedSummary.keyPoints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                      <ul className="space-y-2">
                        {selectedSummary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* File Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">File Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">File Name</p>
                        <p className="font-medium text-gray-900">{selectedSummary.fileName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Document Type</p>
                        <p className="font-medium text-gray-900">{selectedSummary.documentType}</p>
                      </div>
                      {selectedSummary.fileUploadDate && (
                        <div>
                          <p className="text-gray-500">Upload Date</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(selectedSummary.fileUploadDate)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Generated</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(selectedSummary.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
                <p className="text-gray-500">Choose a document from the list to view its summary and analysis</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
