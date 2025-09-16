import React, { useState, useEffect, useCallback } from 'react';
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
        // Only run on client side and when user is available
        if (typeof window === 'undefined' || !user || !user.id) {
          return;
        }
        
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
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError('Failed to initialize dashboard. Please try again.');
        setLoading(false);
      }
    };
    
    initDashboard();
  }, [user, fetchUserData]);

  const fetchUserData = useCallback(async () => {
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
  }, [user, uploads]);

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
    if (typeof window !== 'undefined') {
      window.open(fileUrl, '_blank');
    }
  };

  // Ensure component only renders on client side to avoid SSR issues
  if (typeof window === 'undefined') {
    return null;
  }

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
      {/* Main Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => typeof window !== 'undefined' && (window.location.href = '/dashboard/data')}>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FileIcon className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">My Data</h3>
            <p className="text-sm text-muted-foreground">Manage your personal notes</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => typeof window !== 'undefined' && (window.location.href = '/dashboard/upload-task')}>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <UploadIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
            <p className="text-sm text-muted-foreground">Upload and analyze your study materials</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => typeof window !== 'undefined' && (window.location.href = '/dashboard/library')}>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FileTextIcon className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Knowledge Hub</h3>
            <p className="text-sm text-muted-foreground">Access your library and resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {(uploads.length > 0 || textFiles.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest uploads and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploads.slice(0, 3).map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <FileIcon className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.fileName}</p>
                    <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(file.uploadDate))} ago</p>
                  </div>
                </div>
              ))}
              {textFiles.slice(0, 2).map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <FileTextIcon className="h-6 w-6 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.title}</p>
                    <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(file.createdAt))} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;