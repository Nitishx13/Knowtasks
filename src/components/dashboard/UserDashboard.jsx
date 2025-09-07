import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';

// Icons
import { 
  FileIcon, 
  FileTextIcon, 
  TrashIcon, 
  PencilIcon, 
  EyeIcon,
  UploadIcon,
  ClockIcon,
  CalendarIcon
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [textFiles, setTextFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUploads: 0,
    recentUploads: 0,
    totalTextFiles: 0
  });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const initDashboard = async () => {
      try {
        if (user && user.id) {
          console.log('User authenticated:', user.id);
          
          // Set user name if available
          if (user.firstName || user.lastName) {
            setUserName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
          } else if (user.email) {
            setUserName(user.email.split('@')[0]);
          } else {
            setUserName('User');
          }
          
          // Ensure test auth is set up (works in both development and production)
          if (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' && user.id === 'test_user_123') {
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_test_user_id', user.id);
              localStorage.setItem('auth_test_token', 'test_token');
              console.log('Test authentication configured');
            }
          }
          
          // Fetch user data
          await fetchUserData();
        } else {
          console.error('User data not available for dashboard');
          setError('User authentication required. Please log in or refresh the page.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError('Failed to initialize dashboard. Please try again.');
        setLoading(false);
      }
    };
    
    initDashboard();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user.id) {
        throw new Error('User ID not available');
      }
      
      console.log('Fetching data for user:', user.id);
      
      // Get auth headers with proper error handling
      let headers;
      try {
        headers = await getAuthHeaders(user.id);
        console.log('Auth headers generated:', Object.keys(headers).join(', '));
      } catch (authError) {
        console.warn('Auth headers error:', authError);
        // Fallback for development
        if (process.env.NODE_ENV === 'development') {
          headers = {
            'Authorization': 'Bearer test_token',
            'user-id': user.id || 'test_user_123',
            'Content-Type': 'application/json'
          };
          console.log('Using fallback auth headers for development');
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }
      
      // Fetch user's uploaded files with retry logic
      let filesResponse;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        filesResponse = await fetch(`/api/data/files`, { headers });
        const filesData = await filesResponse.json();
        
        if (filesData.success) {
          console.log('Files data fetched successfully');
          setUploads(filesData.files || []);
          break;
        }
        
        if (filesData.error === 'Unauthorized' && process.env.NODE_ENV === 'development') {
          console.warn(`Auth failed on attempt ${retryCount + 1}, retrying with test token...`);
          headers = {
            'Authorization': 'Bearer test_token',
            'user-id': 'test_user_123',
            'Content-Type': 'application/json'
          };
          retryCount++;
        } else {
          setError(filesData.error || 'Failed to fetch files');
          break;
        }
      }
      
      // Fetch user's text files
      const textResponse = await fetch(`/api/data/text-files`, {
        headers
      });
      const textData = await textResponse.json();
      console.log('Text files data fetched:', textData.success ? 'success' : 'failed');
      
      if (textData.success) {
        setTextFiles(textData.files || []);
        
        // Calculate statistics
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentUploads = uploads.filter(file => 
          new Date(file.uploadDate) > oneWeekAgo
        ).length;
        
        setStats({
          totalUploads: uploads.length,
          recentUploads,
          totalTextFiles: textData.files.length
        });
      } else {
        setError(textData.error || 'Failed to fetch text files');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, fileType) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const endpoint = fileType === 'upload' 
        ? '/api/data/files/delete'
        : '/api/data/text-files/delete';
      
      const headers = await getAuthHeaders(user.id);
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh data after deletion
        fetchUserData();
      } else {
        alert(data.error || 'Failed to delete file');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file');
    }
  };

  const handleViewFile = (fileUrl, fileName) => {
    window.open(fileUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Here's an overview of your content and recent activity.</p>
        </div>
        <Button onClick={fetchUserData} variant="outline" size="sm">
          <ClockIcon className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <FileIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUploads}</div>
            <p className="text-xs text-muted-foreground">Files you've uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground">Uploads in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Text Files</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTextFiles}</div>
            <p className="text-xs text-muted-foreground">Text documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Button variant="outline">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Create Text
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="uploads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="uploads">File Uploads ({uploads.length})</TabsTrigger>
          <TabsTrigger value="text">Text Files ({textFiles.length})</TabsTrigger>
        </TabsList>
        
        {/* Uploads Tab */}
        <TabsContent value="uploads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Uploads</CardTitle>
              <CardDescription>Files you've uploaded to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {uploads.length > 0 ? (
                <div className="space-y-4">
                  {uploads.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{file.fileName}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{file.formattedSize}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(file.uploadDate))} ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewFile(file.fileUrl, file.fileName)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteFile(file.id, 'upload')}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No files uploaded yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by uploading your first file</p>
                  <div className="mt-6">
                    <Button>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Text Files Tab */}
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Text Files</CardTitle>
              <CardDescription>Text documents you've created</CardDescription>
            </CardHeader>
            <CardContent>
              {textFiles.length > 0 ? (
                <div className="space-y-4">
                  {textFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileTextIcon className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-medium">{file.title}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Badge variant="outline">{file.type || 'Text'}</Badge>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(file.createdAt))} ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteFile(file.id, 'text')}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileTextIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No text files created yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first text document</p>
                  <div className="mt-6">
                    <Button>
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Create Text
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;