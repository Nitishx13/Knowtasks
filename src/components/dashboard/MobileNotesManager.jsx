import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const MobileNotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { user } = useAuth();

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    tags: []
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];

  useEffect(() => {
    fetchNotes();
  }, [user?.id]);

  const fetchNotes = async () => {
    if (!user?.id) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/notes', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers,
        body: JSON.stringify(newNote)
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(prev => [data.note, ...prev]);
        setNewNote({ title: '', content: '', subject: '', tags: [] });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch(`/api/notes?id=${editingNote.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(editingNote)
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(prev => prev.map(note => note.id === editingNote.id ? data.note : note));
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE',
        headers
      });
      
      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">My Notes</h1>
          <div className="text-sm text-gray-400">
            {filteredNotes.length} notes
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search and Filter Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex space-x-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                >
                  + New Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Your Notes</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{note.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {note.subject && (
                          <span className="px-2 py-1 bg-blue-600 text-xs rounded-full">{note.subject}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3">{note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
              <p className="text-gray-400 mb-6">Start taking notes to organize your learning</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Note
              </Button>
            </div>
          )}
        </AnimatePresence>
          </div>
        </div>

      {/* Create Note Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="w-full max-w-lg bg-gray-800 rounded-t-2xl sm:rounded-2xl border border-gray-700 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Create New Note</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <select
                    value={newNote.subject}
                    onChange={(e) => setNewNote(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <textarea
                    placeholder="Write your note content here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowCreateModal(false)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateNote}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!newNote.title.trim() || !newNote.content.trim()}
                    >
                      Create Note
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Note Modal */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingNote(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="w-full max-w-lg bg-gray-800 rounded-t-2xl sm:rounded-2xl border border-gray-700 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Edit Note</h2>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={editingNote.title}
                    onChange={(e) => setEditingNote(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <select
                    value={editingNote.subject || ''}
                    onChange={(e) => setEditingNote(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <textarea
                    placeholder="Write your note content here..."
                    value={editingNote.content}
                    onChange={(e) => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setEditingNote(null)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateNote}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!editingNote.title.trim() || !editingNote.content.trim()}
                    >
                      Update Note
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Quick Tips Section */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Organize your content by subject for better management</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Use clear titles and structured content for easy access</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Review and update your content regularly</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileNotesManager;
