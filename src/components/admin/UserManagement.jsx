import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', joinDate: '2024-01-15', lastLogin: '2024-01-20' },
    { id: 2, name: 'Dr. Sarah Wilson', email: 'sarah@example.com', role: 'mentor', status: 'active', joinDate: '2024-01-10', lastLogin: '2024-01-19' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'student', status: 'pending', joinDate: '2024-01-20', lastLogin: 'Never' },
    { id: 4, name: 'Prof. Emily Davis', email: 'emily@example.com', role: 'mentor', status: 'active', joinDate: '2024-01-08', lastLogin: '2024-01-18' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', role: 'student', status: 'inactive', joinDate: '2024-01-12', lastLogin: '2024-01-15' }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
          >
            <option value="all">All Users</option>
            <option value="student">Students</option>
            <option value="mentor">Mentors</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Join Date</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Login</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-1 bg-black/20 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">{user.joinDate}</td>
                <td className="py-4 px-4 text-gray-300 text-sm">{user.lastLogin}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-gray-400 text-sm">Total Users</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-gray-400 text-sm">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'mentor').length}</p>
          <p className="text-gray-400 text-sm">Mentors</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'student').length}</p>
          <p className="text-gray-400 text-sm">Students</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
