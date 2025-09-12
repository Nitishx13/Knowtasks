import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const DatabaseTables = () => {
  const [tables, setTables] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState('superadmin_users');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tables');
      if (response.ok) {
        const data = await response.json();
        setTables(data.data);
        setStats(data.stats);
      } else {
        setError('Failed to fetch table data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const tableConfigs = {
    superadmin_users: {
      name: 'Super Admins',
      icon: '👑',
      color: 'from-red-600 to-red-800',
      columns: ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login', 'Created']
    },
    mentor_users: {
      name: 'Mentors',
      icon: '👨‍🏫',
      color: 'from-blue-600 to-blue-800',
      columns: ['ID', 'Name', 'Email', 'Subject', 'Status', 'Students', 'Last Login', 'Created']
    },
    users: {
      name: 'Students',
      icon: '👨‍🎓',
      color: 'from-green-600 to-green-800',
      columns: ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login', 'Created']
    },
    formula_bank: {
      name: 'Formula Bank',
      icon: '📐',
      color: 'from-purple-600 to-purple-800',
      columns: ['ID', 'Title', 'Category', 'Subject', 'File', 'Size', 'Uploaded By', 'Created']
    },
    flashcards: {
      name: 'Flashcards',
      icon: '🃏',
      color: 'from-yellow-600 to-yellow-800',
      columns: ['ID', 'Title', 'Category', 'Subject', 'File', 'Size', 'Uploaded By', 'Created']
    },
    pyq: {
      name: 'Previous Year Questions',
      icon: '📝',
      color: 'from-indigo-600 to-indigo-800',
      columns: ['ID', 'Title', 'Category', 'Subject', 'Year', 'Exam Type', 'File', 'Size', 'Created']
    },
    summaries: {
      name: 'Summaries',
      icon: '📄',
      color: 'from-teal-600 to-teal-800',
      columns: ['ID', 'Title', 'Word Count', 'User ID', 'Created']
    },
    notes: {
      name: 'Notes',
      icon: '📝',
      color: 'from-pink-600 to-pink-800',
      columns: ['ID', 'Title', 'User ID', 'Created']
    }
  };

  const renderTableData = (tableName, data) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">No data available</p>
        </div>
      );
    }

    const config = tableConfigs[tableName];
    if (!config) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {config.columns.map((col, index) => (
                <th key={index} className="text-left p-3 text-gray-300 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id || index} className="border-b border-gray-800 hover:bg-gray-800/50">
                {tableName === 'superadmin_users' && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white">{row.name}</td>
                    <td className="p-3 text-blue-400">{row.email}</td>
                    <td className="p-3 text-gray-300">{row.role}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{formatDate(row.last_login)}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
                {tableName === 'mentor_users' && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white">{row.name}</td>
                    <td className="p-3 text-blue-400">{row.email}</td>
                    <td className="p-3 text-purple-400">{row.subject}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-white">{row.students_count || 0}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.last_login)}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
                {tableName === 'users' && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white">{row.name}</td>
                    <td className="p-3 text-blue-400">{row.email}</td>
                    <td className="p-3 text-gray-300">{row.role}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{formatDate(row.last_login)}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
                {(tableName === 'formula_bank' || tableName === 'flashcards') && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white max-w-xs truncate">{row.title}</td>
                    <td className="p-3 text-purple-400">{row.category}</td>
                    <td className="p-3 text-blue-400">{row.subject}</td>
                    <td className="p-3 text-gray-300 max-w-xs truncate">{row.file_name}</td>
                    <td className="p-3 text-gray-400">{formatFileSize(row.file_size)}</td>
                    <td className="p-3 text-green-400">{row.uploaded_by}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
                {tableName === 'pyq' && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white max-w-xs truncate">{row.title}</td>
                    <td className="p-3 text-purple-400">{row.category}</td>
                    <td className="p-3 text-blue-400">{row.subject}</td>
                    <td className="p-3 text-yellow-400">{row.year}</td>
                    <td className="p-3 text-orange-400">{row.exam_type}</td>
                    <td className="p-3 text-gray-300 max-w-xs truncate">{row.file_name}</td>
                    <td className="p-3 text-gray-400">{formatFileSize(row.file_size)}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
                {tableName === 'summaries' && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white max-w-xs truncate">{row.title}</td>
                    <td className="p-3 text-blue-400">{row.word_count}</td>
                    <td className="p-3 text-gray-400">{row.user_id}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
                {tableName === 'notes' && (
                  <>
                    <td className="p-3 text-white">{row.id}</td>
                    <td className="p-3 text-white max-w-xs truncate">{row.title}</td>
                    <td className="p-3 text-gray-400">{row.user_id}</td>
                    <td className="p-3 text-gray-400">{formatDate(row.created_at)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading database tables...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchTableData} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Database Tables Overview</h2>
          <Button onClick={fetchTableData} className="bg-blue-600 hover:bg-blue-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Stats */}
      <div className="p-6 border-b border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(tableConfigs).map(([tableName, config]) => {
            const stat = stats[tableName];
            return (
              <motion.button
                key={tableName}
                onClick={() => setActiveTable(tableName)}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  activeTable === tableName
                    ? 'border-white/40 bg-white/10'
                    : 'border-gray-700 hover:border-gray-600 bg-black/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-2">{config.icon}</div>
                <div className="text-white font-bold text-lg">
                  {stat?.count || 0}
                </div>
                <div className="text-gray-400 text-xs">
                  {config.name}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Table Data */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="text-2xl mr-2">{tableConfigs[activeTable]?.icon}</span>
            {tableConfigs[activeTable]?.name}
            <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              {stats[activeTable]?.count || 0} records
            </span>
          </h3>
        </div>
        
        <div className="bg-black/20 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
          {renderTableData(activeTable, tables[activeTable])}
        </div>
      </div>
    </div>
  );
};

export default DatabaseTables;
