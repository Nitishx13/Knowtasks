import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import MentorCreationModal from './MentorCreationModal';

const ComprehensiveMentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentors/list');
      const data = await response.json();

      if (response.ok && data.success) {
        setMentors(data.mentors);
      } else {
        setError(data.error || 'Failed to fetch mentors');
      }
    } catch (error) {
      console.error('Fetch mentors error:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorCreated = (newMentor) => {
    setMentors(prev => [newMentor, ...prev]);
    setShowCreateModal(false);
  };

  const handleStatusToggle = async (mentorId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/mentors/${mentorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMentors(prev => prev.map(mentor => 
          mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
        ));
      }
    } catch (error) {
      console.error('Status toggle error:', error);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || mentor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Mentor Management System</h2>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Mentor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search mentors by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 border-b border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{mentors.length}</div>
            <div className="text-blue-300 text-sm">Total Mentors</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {mentors.filter(m => m.status === 'active').length}
            </div>
            <div className="text-green-300 text-sm">Active Mentors</div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {mentors.reduce((sum, m) => sum + (m.profile?.active_students || 0), 0)}
            </div>
            <div className="text-purple-300 text-sm">Total Students</div>
          </div>
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-400">
              {mentors.reduce((sum, m) => sum + (m.profile?.total_uploads || 0), 0)}
            </div>
            <div className="text-orange-300 text-sm">Total Uploads</div>
          </div>
        </div>
      </div>

      {/* Mentors List */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {filteredMentors.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-400">No mentors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                className="bg-black/20 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Mentor Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {mentor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-semibold">{mentor.name}</h3>
                      <p className="text-gray-400 text-sm">{mentor.subject}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mentor.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {mentor.status}
                  </span>
                </div>

                {/* Mentor Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-gray-300">{mentor.email}</span>
                  </div>
                  {mentor.phone && (
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-300">{mentor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-4" />
                    </svg>
                    <span className="text-gray-300">{mentor.experience} years experience</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{mentor.profile?.active_students || 0}</div>
                    <div className="text-xs text-gray-400">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{mentor.profile?.total_uploads || 0}</div>
                    <div className="text-xs text-gray-400">Uploads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{mentor.profile?.rating || 0}</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(mentor.created_at)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleStatusToggle(mentor.id, mentor.status)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        mentor.status === 'active'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {mentor.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <MentorCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onMentorCreated={handleMentorCreated}
      />

      {/* Mentor Details Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Mentor Details</h2>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">{selectedMentor.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">{selectedMentor.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Subject:</span>
                      <span className="text-white ml-2">{selectedMentor.subject}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white ml-2">{selectedMentor.experience} years</span>
                    </div>
                    {selectedMentor.specialization && (
                      <div>
                        <span className="text-gray-400">Specialization:</span>
                        <span className="text-white ml-2">{selectedMentor.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Active Students:</span>
                      <span className="text-white ml-2">{selectedMentor.profile?.active_students || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Uploads:</span>
                      <span className="text-white ml-2">{selectedMentor.profile?.total_uploads || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Sessions:</span>
                      <span className="text-white ml-2">{selectedMentor.profile?.total_sessions || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white ml-2">{selectedMentor.profile?.rating || 0}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedMentor.bio && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Bio</h3>
                  <p className="text-gray-300">{selectedMentor.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveMentorManagement;
