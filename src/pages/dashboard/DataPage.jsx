import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

function formatTotalSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const DataPage = () => {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // Get current user from auth context
  const { user } = useAuth();

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Ensure user is authenticated
      if (!user || !user.id) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      const headers = await getAuthHeaders(user.id);
      
      // Fetch all data in parallel
      const [filesRes, notesRes, formulasRes, conceptsRes] = await Promise.all([
        fetch(`/api/data/files?userId=${user.id}`, { headers }),
        fetch('/api/notes/get', { headers }),
        fetch('/api/formulas/get', { headers }),
        fetch('/api/concepts/get', { headers })
      ]);
      
      const [filesData, notesData, formulasData, conceptsData] = await Promise.all([
        filesRes.json(),
        notesRes.json(),
        formulasRes.json(),
        conceptsRes.json()
      ]);
      
      if (filesData.success) setFiles(filesData.files || []);
      if (notesData.success) setNotes(notesData.notes || []);
      if (formulasData.success) setFormulas(formulasData.formulas || []);
      if (conceptsData.success) setConcepts(conceptsData.concepts || []);
      
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
    
    // Cleanup function to reset selection when component unmounts
    return () => {
      setSelectedFiles([]);
      setSelectAll(false);
    };
  }, [fetchAllData, user]);

  // Prevent SSR issues by only rendering on client
  if (typeof window === 'undefined') {
    return null;
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.uploadSource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || file.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        // Ensure user is authenticated
        if (!user || !user.id) {
          setError('Authentication required');
          return;
        }
        
        const headers = await getAuthHeaders(user.id);
        const response = await fetch('/api/data/files/delete', {
          method: 'DELETE',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileIds: selectedFiles }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Refresh the file list after successful deletion
          fetchFiles();
        } else {
          alert('Failed to delete file: ' + data.error);
        }
      } catch (err) {
        console.error('Error deleting file:', err);
        alert('Failed to delete file. Please try again.');
      }
    }
  };



  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFiles([]);
      setSelectAll(false);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      try {
        // Ensure user is authenticated
        if (!user || !user.id) {
          setError('Authentication required');
          return;
        }
        
        setBulkDeleting(true);
        
        // Delete files one by one
        for (const fileId of selectedFiles) {
          const headers = await getAuthHeaders(user.id);
          const response = await fetch('/api/data/files/delete', {
            method: 'DELETE',
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId }),
          });

          if (!response.ok) {
            console.error(`Failed to delete file ${fileId}`);
          }
        }

        // Clear selection and refresh
        setSelectedFiles([]);
        setSelectAll(false);
        fetchFiles();
        alert(`Successfully deleted ${selectedFiles.length} files`);
      } catch (err) {
        console.error('Error in bulk delete:', err);
        alert('Some files could not be deleted. Please try again.');
      } finally {
        setBulkDeleting(false);
      }
    }
  };

  const handleDownloadFile = async (fileUrl, fileName, fileId) => {
    try {
      // Ensure user is authenticated
      if (!user || !user.id) {
        setError('Authentication required');
        return;
      }
      
      // Verify file belongs to user before downloading
      const headers = await getAuthHeaders(user.id);
      const response = await fetch(`/api/data/files/verify?fileId=${fileId}&userId=${user.id}`, {
        headers
      });
      const data = await response.json();
      
      if (!data.success) {
        alert('You do not have permission to download this file');
        return;
      }
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchFiles} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">📚 My Study Materials</h1>
          <p className="text-gray-600 mt-2">View and manage all your notes, formulas, concepts, and files</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchAllData} variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium">✍️ Notes</CardTitle>
            <span className="text-blue-600">📝</span>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6 pt-1 md:pt-2">
            <div className="text-xl md:text-2xl font-bold">{notes.length}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Study notes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">🧮 Formulas</CardTitle>
            <span className="text-green-600">📐</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{formulas.length}</div>
            <p className="text-xs text-muted-foreground">Saved formulas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">💡 Concepts</CardTitle>
            <span className="text-purple-600">🧠</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{concepts.length}</div>
            <p className="text-xs text-muted-foreground">Concept maps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">📁 Files</CardTitle>
            <span className="text-gray-600">📄</span>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{files.length}</div>
            <p className="text-xs text-muted-foreground">Uploaded files</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Study Materials</CardTitle>
          <CardDescription>Browse your saved content by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✍️ Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'formulas'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🧮 Formulas ({formulas.length})
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'concepts'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💡 Concepts ({concepts.length})
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'files'
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📁 Files ({files.length})
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
            <div>
              <CardTitle>
                {activeTab === 'notes' && '✍️ My Notes'}
                {activeTab === 'formulas' && '🧮 My Formulas'}
                {activeTab === 'concepts' && '💡 My Concepts'}
                {activeTab === 'files' && '📁 Uploaded Files'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'notes' && `${notes.filter(note => note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || note.content?.toLowerCase().includes(searchTerm.toLowerCase())).length} of ${notes.length} notes`}
                {activeTab === 'formulas' && `${formulas.filter(formula => formula.name?.toLowerCase().includes(searchTerm.toLowerCase()) || formula.description?.toLowerCase().includes(searchTerm.toLowerCase())).length} of ${formulas.length} formulas`}
                {activeTab === 'concepts' && `${concepts.filter(concept => concept.title?.toLowerCase().includes(searchTerm.toLowerCase()) || concept.description?.toLowerCase().includes(searchTerm.toLowerCase())).length} of ${concepts.length} concepts`}
                {activeTab === 'files' && `${filteredFiles.length} of ${files.length} files`}
              </CardDescription>
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm text-gray-600">
                  {selectedFiles.length} file(s) selected
                </span>
                <Button
                  onClick={handleBulkDelete}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-900 border-red-300"
                  disabled={bulkDeleting}
                >
                  {bulkDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Selected'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Notes Display */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {notes.filter(note => 
                note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                note.content?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-500">No notes found</p>
                  <p className="text-gray-400 text-sm">Start creating notes in the Upload Task page</p>
                </div>
              ) : (
                notes.filter(note => 
                  note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  note.content?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((note) => (
                  <div key={note.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-900">{note.title}</h3>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{note.subject}</span>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">{note.summary || note.content?.substring(0, 200)}...</p>
                    <div className="flex justify-between items-center text-xs text-blue-600">
                      <div className="flex gap-4">
                        {note.chapter && <span>Chapter: {note.chapter}</span>}
                        <span>{note.difficulty}</span>
                        <span>{note.word_count} words</span>
                      </div>
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Formulas Display */}
          {activeTab === 'formulas' && (
            <div className="space-y-4">
              {formulas.filter(formula => 
                formula.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                formula.description?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🧮</div>
                  <p className="text-gray-500">No formulas found</p>
                  <p className="text-gray-400 text-sm">Start adding formulas in the Upload Task page</p>
                </div>
              ) : (
                formulas.filter(formula => 
                  formula.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  formula.description?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((formula) => (
                  <div key={formula.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-green-900">{formula.name}</h3>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{formula.subject}</span>
                    </div>
                    <div className="bg-white p-3 rounded border font-mono text-sm mb-3">{formula.formula}</div>
                    <p className="text-sm text-green-800 mb-3">{formula.description}</p>
                    {formula.applications && (
                      <div className="text-sm text-green-700 mb-3">
                        <strong>Applications:</strong> {formula.applications}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-green-600">
                      <div className="flex gap-4">
                        {formula.chapter && <span>Chapter: {formula.chapter}</span>}
                        <span>{formula.difficulty}</span>
                      </div>
                      <span>{new Date(formula.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Concepts Display */}
          {activeTab === 'concepts' && (
            <div className="space-y-4">
              {concepts.filter(concept => 
                concept.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                concept.description?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💡</div>
                  <p className="text-gray-500">No concepts found</p>
                  <p className="text-gray-400 text-sm">Start creating concept maps in the Upload Task page</p>
                </div>
              ) : (
                concepts.filter(concept => 
                  concept.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  concept.description?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((concept) => (
                  <div key={concept.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-purple-900">{concept.title}</h3>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">{concept.subject}</span>
                    </div>
                    <p className="text-sm text-purple-800 mb-3">{concept.description}</p>
                    {concept.key_points && (
                      <div className="text-sm text-purple-700 mb-3">
                        <strong>Key Points:</strong>
                        <div className="mt-1 whitespace-pre-line">{concept.key_points}</div>
                      </div>
                    )}
                    {concept.examples && (
                      <div className="text-sm text-purple-700 mb-3">
                        <strong>Examples:</strong> {concept.examples}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-purple-600">
                      <div className="flex gap-4">
                        {concept.chapter && <span>Chapter: {concept.chapter}</span>}
                        <span>{concept.difficulty}</span>
                      </div>
                      <span>{new Date(concept.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Files Display */}
          {activeTab === 'files' && (
            <>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-base md:text-lg">No files found</p>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 text-[10px] md:text-xs">
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-sm">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-xs md:text-sm font-medium text-gray-900">{file.fileName}</div>
                              <div className="text-[10px] md:text-xs text-gray-500">ID: {file.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                          {file.formattedSize}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-green-100 text-green-800">
                            {file.uploadSource}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                            file.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                            file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            file.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleDownloadFile(file.fileUrl, file.fileName, file.id)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-900 text-xs md:text-sm px-2 md:px-3 py-1"
                            >
                              Download
                            </Button>
                            
                            <Button
                              onClick={() => handleDeleteFile(file.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-900 text-xs md:text-sm px-2 md:px-3 py-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card View - Visible only on Mobile */}
              <div className="md:hidden space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-xs font-medium text-gray-500">Select All</span>
                  </div>
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-200 hover:bg-red-100"
                    >
                      Delete Selected
                    </button>
                  )}
                </div>
                
                {filteredFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{file.fileName}</h3>
                            <p className="text-xs text-gray-500 mt-1">ID: {file.id}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          file.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                          file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          file.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {file.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-1 text-gray-900">{file.formattedSize}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Source:</span>
                          <span className="ml-1 text-gray-900">{file.uploadSource}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Uploaded:</span>
                          <span className="ml-1 text-gray-900">{file.formattedDate}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => handleDownloadFile(file.fileUrl, file.fileName, file.id)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded border border-blue-200 hover:bg-blue-100"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-200 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPage;
