import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([
    { 
      id: 1, 
      name: 'Dr. Sarah Wilson', 
      email: 'sarah.wilson@knowtasks.com', 
      password: 'Mentor@123', 
      subject: 'Physics', 
      status: 'active', 
      students: 45, 
      joinDate: '2024-01-10',
      lastLogin: '2024-01-20'
    },
    { 
      id: 2, 
      name: 'Prof. Michael Chen', 
      email: 'michael.chen@knowtasks.com', 
      password: 'Physics@456', 
      subject: 'Chemistry', 
      status: 'active', 
      students: 38, 
      joinDate: '2024-01-12',
      lastLogin: '2024-01-19'
    },
    { 
      id: 3, 
      name: 'Dr. Emily Davis', 
      email: 'emily.davis@knowtasks.com', 
      password: 'Math@789', 
      subject: 'Mathematics', 
      status: 'pending', 
      students: 0, 
      joinDate: '2024-01-18',
      lastLogin: 'Never'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    password: '',
    subject: '',
    status: 'active'
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddMentor = () => {
    if (newMentor.name && newMentor.email && newMentor.subject) {
      const password = newMentor.password || generatePassword();
      const mentor = {
        id: mentors.length + 1,
        ...newMentor,
        password,
        students: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      
      setMentors([...mentors, mentor]);
      setNewMentor({ name: '', email: '', password: '', subject: '', status: 'active' });
      setShowAddModal(false);
      
      // Store mentor credentials in localStorage
      const existingMentors = JSON.parse(localStorage.getItem('mentor_credentials') || '[]');
      existingMentors.push({
        email: mentor.email,
        password: mentor.password,
        name: mentor.name,
        id: mentor.id
      });
      localStorage.setItem('mentor_credentials', JSON.stringify(existingMentors));
    }
  };

  const handleDeleteMentor = (mentorId) => {
    setMentors(mentors.filter(m => m.id !== mentorId));
    
    // Remove from localStorage
    const existingMentors = JSON.parse(localStorage.getItem('mentor_credentials') || '[]');
    const updatedMentors = existingMentors.filter(m => m.id !== mentorId);
    localStorage.setItem('mentor_credentials', JSON.stringify(updatedMentors));
  };

  const handleStatusChange = (mentorId, newStatus) => {
    setMentors(mentors.map(m => 
      m.id === mentorId ? { ...m, status: newStatus } : m
    ));
  };

  const showPassword = (mentor) => {
    setSelectedMentor(mentor);
    setShowPasswordModal(true);
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-white">Mentor Management</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Mentor
          </Button>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredMentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            className="bg-black/20 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-bold">{mentor.name}</h3>
                  <p className="text-gray-400 text-sm">{mentor.subject}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                mentor.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {mentor.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{mentor.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Students:</span>
                <span className="text-white">{mentor.students}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Login:</span>
                <span className="text-white">{mentor.lastLogin}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => showPassword(mentor)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs flex-1"
              >
                View Password
              </Button>
              <select
                value={mentor.status}
                onChange={(e) => handleStatusChange(mentor.id, e.target.value)}
                className="px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-xs focus:outline-none focus:border-white/40"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button
                size="sm"
                onClick={() => handleDeleteMentor(mentor.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{mentors.length}</p>
          <p className="text-gray-400 text-sm">Total Mentors</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{mentors.filter(m => m.status === 'active').length}</p>
          <p className="text-gray-400 text-sm">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{mentors.filter(m => m.status === 'pending').length}</p>
          <p className="text-gray-400 text-sm">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{mentors.reduce((sum, m) => sum + m.students, 0)}</p>
          <p className="text-gray-400 text-sm">Total Students</p>
        </div>
      </div>

      {/* Add Mentor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Add New Mentor</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newMentor.name}
                onChange={(e) => setNewMentor({...newMentor, name: e.target.value})}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newMentor.email}
                onChange={(e) => setNewMentor({...newMentor, email: e.target.value})}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <div className="flex space-x-2">
                <input
                  type="password"
                  placeholder="Password (leave empty to auto-generate)"
                  value={newMentor.password}
                  onChange={(e) => setNewMentor({...newMentor, password: e.target.value})}
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                />
                <Button
                  onClick={() => setNewMentor({...newMentor, password: generatePassword()})}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2"
                >
                  Generate
                </Button>
              </div>
              <select
                value={newMentor.subject}
                onChange={(e) => setNewMentor({...newMentor, subject: e.target.value})}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="">Select Subject</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMentor}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Add Mentor
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Mentor Login Credentials</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Name:</p>
                <p className="text-white font-medium">{selectedMentor.name}</p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Email:</p>
                <p className="text-white font-medium">{selectedMentor.email}</p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-gray-400 text-sm mb-1">Password:</p>
                <p className="text-white font-mono bg-red-500/20 p-2 rounded border border-red-500/30">{selectedMentor.password}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">⚠️ Keep these credentials secure. Share only with the mentor.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowPasswordModal(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MentorManagement;
