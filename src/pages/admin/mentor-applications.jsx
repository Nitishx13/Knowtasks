import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const MentorApplicationsPage = () => {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'verified'

  // Fetch mentor applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/mentors/list');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch mentor applications');
        }
        
        setApplications(data.mentors || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  // Handle verification status change
  const handleVerificationChange = async (mentorId, verified) => {
    try {
      const response = await fetch('/api/mentors/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mentorId, verified })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update verification status');
      }
      
      // Update the local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === mentorId ? { ...app, verified, status: verified ? 'active' : 'pending' } : app
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter applications based on selected filter
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !app.verified;
    if (filter === 'verified') return app.verified;
    return true;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mentor Applications</h1>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'verified' ? 'default' : 'outline'}
            onClick={() => setFilter('verified')}
          >
            Verified
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No mentor applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{mentor.name}</CardTitle>
                    <CardDescription>{mentor.email}</CardDescription>
                  </div>
                  <Badge className={`${mentor.verified ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {mentor.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Subject:</span>
                    <span className="text-sm">{mentor.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Experience:</span>
                    <span className="text-sm">{mentor.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{mentor.phone}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Bio:</span>
                    <p className="text-sm mt-1 line-clamp-3">{mentor.bio}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/admin/mentor-detail/${mentor.id}`)}
                >
                  View Details
                </Button>
                {mentor.verified ? (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleVerificationChange(mentor.id, false)}
                  >
                    Revoke Access
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleVerificationChange(mentor.id, true)}
                  >
                    Verify & Activate
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorApplicationsPage;