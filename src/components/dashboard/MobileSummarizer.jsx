import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const MobileSummarizer = () => {
  const [documents, setDocuments] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDocuments();
    fetchSummaries();
  }, [user?.id]);

  const fetchDocuments = async () => {
    if (!user?.id) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/documents', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchSummaries = async () => {
    if (!user?.id) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/summaries', { headers });
      
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

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const headers = await getAuthHeaders(user.id);
      delete headers['Content-Type']; // Let browser set content type for FormData
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(prev => [data.document, ...prev]);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSummarize = async (documentId) => {
    setSummarizing(true);
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers,
        body: JSON.stringify({ documentId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSummaries(prev => [data.summary, ...prev]);
      }
    } catch (error) {
      console.error('Error creating summary:', error);
    } finally {
      setSummarizing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">AI Summarizer</h1>
          <div className="text-sm text-gray-400">
            {documents.length} docs • {summaries.length} summaries
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Upload Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-400">Uploading document...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <p className="text-white font-medium mb-2">
                      Drop your document here or click to browse
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports PDF, DOC, DOCX, TXT files
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Your Documents</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{doc.title}</h3>
                            <p className="text-gray-400 text-sm">
                              {new Date(doc.created_at).toLocaleDateString()} • {doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : 'Unknown size'}
                            </p>
                          </div>
                        </div>
                        
                        {doc.summary ? (
                          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 mb-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-green-400 text-sm font-medium">Summary Available</span>
                            </div>
                            <p className="text-gray-300 text-sm line-clamp-3">{doc.summary}</p>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleSummarize(doc.id)}
                            disabled={summarizing}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4"
                          >
                            {summarizing ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                <span>Summarizing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Generate Summary</span>
                              </div>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                  <p className="text-gray-400">Upload your first document to get started with AI summaries</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recent Summaries */}
        {summaries.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Recent Summaries</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {summaries.slice(0, 5).map((summary, index) => (
                  <motion.div
                    key={summary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">{summary.title}</h3>
                        <p className="text-gray-300 text-sm mb-2 line-clamp-3">{summary.content}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(summary.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pro Tips
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Upload clear, well-structured documents for better summaries</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>AI summaries work best with academic papers and articles</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Use summaries to create flashcards and study notes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileSummarizer;
