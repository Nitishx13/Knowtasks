import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function QZFolderPage() {
  const [qzFiles, setQzFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'favorites'

  // Fetch QZ files
  useEffect(() => {
    const fetchQZFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/qz-folder/list');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        let data;
        
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid response format from server');
        }
        
        if (data.success) {
          setQzFiles(data.files || []);
        } else {
          throw new Error(data.error || 'Failed to fetch QZ files');
        }
      } catch (err) {
        console.error('Fetch QZ files error:', err);
        setError(err.message);
        setQzFiles([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchQZFiles();
  }, []);

  // Filter files based on search term and filter
  const filteredFiles = qzFiles.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(file.created_at) > oneWeekAgo;
    } else if (filter === 'favorites') {
      return matchesSearch && file.is_favorite;
    }
    
    return matchesSearch;
  });

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('description', 'Uploaded QZ file');

    try {
      const response = await fetch('/api/qz-folder/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the file list
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to upload file');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    }
  };

  // Handle file download
  const handleDownload = (file) => {
    window.open(`/api/qz-folder/download/${file.id}`, '_blank');
  };

  // Handle file delete
  const handleDelete = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/qz-folder/delete/${fileId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setQzFiles(qzFiles.filter(file => file.id !== fileId));
      } else {
        throw new Error(data.error || 'Failed to delete file');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (fileId) => {
    try {
      const response = await fetch(`/api/qz-folder/favorite/${fileId}`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        setQzFiles(qzFiles.map(file => 
          file.id === fileId 
            ? { ...file, is_favorite: !file.is_favorite }
            : file
        ));
      } else {
        throw new Error(data.error || 'Failed to update favorite status');
      }
    } catch (err) {
      console.error('Favorite toggle error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QZ Folder</h1>
              <p className="text-gray-600">Manage your question papers and quizzes</p>
            </div>
            // In the header section of qz-folder.jsx, modify the header div to include a Create Quiz button
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/qz-maker">
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  Create Quiz
                </Button>
              </Link>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Upload QZ File
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search QZ files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All Files
              </Button>
              <Button
                variant={filter === 'recent' ? 'default' : 'outline'}
                onClick={() => setFilter('recent')}
              >
                Recent
              </Button>
              <Button
                variant={filter === 'favorites' ? 'default' : 'outline'}
                onClick={() => setFilter('favorites')}
              >
                Favorites
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No QZ files found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first QZ file to get started'}
            </p>
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors inline-block"
            >
              Upload QZ File
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{file.title}</CardTitle>
                        <CardDescription className="mt-1">{file.subject}</CardDescription>
                      </div>
                      <button
                        onClick={() => handleFavoriteToggle(file.id)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {file.is_favorite ? '⭐' : '☆'}
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {file.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{new Date(file.created_at).toLocaleDateString()}</span>
                      <Badge variant="secondary">{file.file_type}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(file)}
                        className="flex-1"
                      >
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {qzFiles.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Files</h3>
              <p className="text-2xl font-bold text-gray-900">{qzFiles.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Favorites</h3>
              <p className="text-2xl font-bold text-gray-900">
                {qzFiles.filter(f => f.is_favorite).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Recent (7 days)</h3>
              <p className="text-2xl font-bold text-gray-900">
                {qzFiles.filter(f => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(f.created_at) > oneWeekAgo;
                }).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
