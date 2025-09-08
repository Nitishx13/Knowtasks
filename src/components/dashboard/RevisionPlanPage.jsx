import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders } from '@/utils/auth';

const RevisionPlanPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planItems, setPlanItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchPlanData();
    }
  }, [user]);

  const fetchPlanData = async () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call with mock data
    try {
      // In a real implementation, this would be an API call
      // const headers = getAuthHeaders(user);
      // const response = await fetch(`/api/revision-plan?userId=${user.id}`, { headers });
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockData = [
        {
          id: 1,
          title: 'Mathematics Revision',
          description: 'Review calculus concepts and practice problems',
          type: 'revision',
          dueDate: '2023-10-15',
          priority: 'high',
          completed: false
        },
        {
          id: 2,
          title: 'Physics Lab Preparation',
          description: 'Prepare notes and review experiment procedures',
          type: 'revision',
          dueDate: '2023-10-18',
          priority: 'medium',
          completed: false
        },
        {
          id: 3,
          title: 'Daily Study Plan - Week 42',
          description: 'Structured study schedule for the current week',
          type: 'daily',
          dueDate: '2023-10-22',
          priority: 'high',
          completed: false
        },
        {
          id: 4,
          title: 'Chemistry Exam Preparation',
          description: 'Review organic chemistry reactions and mechanisms',
          type: 'revision',
          dueDate: '2023-10-25',
          priority: 'high',
          completed: false
        },
        {
          id: 5,
          title: 'Weekend Study Schedule',
          description: 'Focused study plan for the upcoming weekend',
          type: 'daily',
          dueDate: '2023-10-14',
          priority: 'medium',
          completed: false
        },
        {
          id: 6,
          title: 'Biology Revision Notes',
          description: 'Compile and organize notes for biology midterm',
          type: 'revision',
          dueDate: '2023-10-30',
          priority: 'low',
          completed: false
        }
      ];
      
      setPlanItems(mockData);
    } catch (err) {
      console.error('Error fetching plan data:', err);
      setError('Failed to load revision and daily plan data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = () => {
    if (activeFilter === 'all') return planItems;
    return planItems.filter(item => item.type === activeFilter);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Revision & Daily Plan</h1>
          <p className="text-gray-600">Organize your study schedule and revision materials</p>
        </div>
        <Button variant="outline">Create New Plan</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div>
          <div className="flex space-x-2 mb-4">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'revision' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('revision')}
            >
              Revision Materials
            </Button>
            <Button 
              variant={activeFilter === 'daily' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('daily')}
            >
              Daily Plans
            </Button>
          </div>
          
          {filteredItems().length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No plans or revision materials found.</p>
              <Button variant="link" className="mt-2">Create your first plan</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems().map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityClass(item.priority)}`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Due: {item.dueDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{item.type}</span>
                    <Button variant="link" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RevisionPlanPage;