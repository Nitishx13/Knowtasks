import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';

const MentorDashboard = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Physics',
    subject: 'Physics',
    tags: []
  });
  const [formulaBankItems, setFormulaBankItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Fetch Formula Bank items
  const fetchFormulaBankItems = async () => {
    setLoading(true);
    try {
      console.log('Fetching Formula Bank items...');
      const response = await fetch('/api/formula-bank/list');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Formula Bank API response:', data);
        console.log('Number of items:', data.data?.length || 0);
        setFormulaBankItems(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch Formula Bank items:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching Formula Bank items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulaBankItems();
  }, []);

  // Upload Formula Bank PDF
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!e.target.file.files[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.file.files[0]);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);
    formData.append('subject', uploadForm.subject);
    formData.append('uploadedBy', 'mentor');
    formData.append('uploaderRole', 'mentor');
    formData.append('tags', JSON.stringify(uploadForm.tags));

    try {
      const response = await fetch('/api/formula-bank/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'Physics',
          subject: 'Physics',
          tags: []
        });
        fetchFormulaBankItems();
        alert('Formula Bank PDF uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle PDF viewing
  const handleViewPDF = (item) => {
    setSelectedPDF(item);
    setShowPDFModal(true);
  };

  // Handle PDF download
  const handleDownloadPDF = (item) => {
    // Create download link
    const link = document.createElement('a');
    link.href = item.file_url || `/uploads/${item.file_name || item.fileName}`;
    link.download = item.file_name || item.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Hey there 👋</h1>
        <p className="text-gray-400 text-base md:text-lg">Welcome back to your Mentor dashboard</p>
      </div>

      {/* Formula Bank Upload Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Formula Bank Management</h2>
          <p className="text-blue-100 mb-4">Upload and manage Formula Bank PDFs for students</p>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 font-semibold"
          >
            Upload Formula Bank PDF
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-full opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
      </div>

      {/* Formula Bank Items Display */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Formula Bank PDFs</h2>
          <span className="text-gray-400 text-sm">{formulaBankItems.length} items</span>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-gray-400 mt-2">Loading Formula Bank items...</p>
          </div>
        ) : formulaBankItems.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-4">No Formula Bank PDFs uploaded yet</p>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Upload Your First PDF
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formulaBankItems.map((item) => (
              <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-gray-700 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {new Date(item.created_at || item.uploadedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewPDF(item)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDownloadPDF(item)}
                      className="text-gray-400 hover:text-white"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upload Formula Bank PDF</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  placeholder="Enter formula bank title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Brief description of the formulas"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploading ? 'Uploading...' : 'Upload PDF'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPDFModal && selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedPDF.title}</h2>
                <p className="text-sm text-gray-600">{selectedPDF.category} - {selectedPDF.subject}</p>
              </div>
              <button
                onClick={() => setShowPDFModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-4">
              <iframe
                src={selectedPDF.file_url || `/uploads/${selectedPDF.file_name || selectedPDF.fileName}`}
                className="w-full h-full border rounded-lg"
                title={selectedPDF.title}
                onError={(e) => {
                  console.error('PDF load error:', e);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <p>PDF preview not available</p>
                  <p className="text-sm">Click download to view the file</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p><strong>Description:</strong> {selectedPDF.description}</p>
                <p><strong>Uploaded:</strong> {new Date(selectedPDF.created_at || selectedPDF.uploadedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownloadPDF(selectedPDF)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Download PDF
                </Button>
                <Button
                  onClick={() => setShowPDFModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorDashboard;
