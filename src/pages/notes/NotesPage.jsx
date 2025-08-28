import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notesService } from '../../services/api';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeNote, setActiveNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await notesService.getNotes();
        setNotes(response.notes);
        setError(null);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteClick = (note) => {
    setActiveNote(note);
    setNewNote({ title: note.title, content: note.content });
  };

  const handleNewNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNote = async () => {
    if (newNote.title.trim() === '' || newNote.content.trim() === '') return;
    
    try {
      const response = await notesService.createNote(newNote.title, newNote.content);
      setNotes([response.note, ...notes]);
      setNewNote({ title: '', content: '' });
      setActiveNote(null);
    } catch (err) {
      console.error('Error creating note:', err);
      alert(typeof err === 'string' ? err : 'Failed to create note. Please try again.');
    }
  };

  const handleUpdateNote = async () => {
    if (!activeNote) return;
    if (newNote.title.trim() === '' || newNote.content.trim() === '') return;

    try {
      const response = await notesService.updateNote(
        activeNote.id, 
        newNote.title, 
        newNote.content
      );
      
      const updatedNotes = notes.map(note => {
        if (note.id === activeNote.id) {
          return response.note;
        }
        return note;
      });

      setNotes(updatedNotes);
      setActiveNote(null);
      setNewNote({ title: '', content: '' });
    } catch (err) {
      console.error('Error updating note:', err);
      alert(typeof err === 'string' ? err : 'Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesService.deleteNote(id);
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      
      if (activeNote && activeNote.id === id) {
        setActiveNote(null);
        setNewNote({ title: '', content: '' });
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      alert(typeof err === 'string' ? err : 'Failed to delete note. Please try again.');
    }
  };

  return (
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <button 
              onClick={() => {
                setActiveNote(null);
                setNewNote({ title: '', content: '' });
              }}
              className="w-full btn-primary mb-4"
            >
              New Note
            </button>
            <div className="space-y-2">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  className={`p-3 rounded-md cursor-pointer ${activeNote && activeNote.id === note.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-gray-100'}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{note.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <input
                type="text"
                name="title"
                placeholder="Note Title"
                className="w-full text-2xl font-bold border-b border-gray-300 pb-2 focus:outline-none focus:border-primary"
                value={newNote.title}
                onChange={handleNewNoteChange}
              />
            </div>
            <div className="mb-6">
              <textarea
                name="content"
                placeholder="Start writing your note here..."
                className="w-full h-64 text-gray-800 border-gray-300 focus:outline-none focus:border-primary resize-none"
                value={newNote.content}
                onChange={handleNewNoteChange}
              ></textarea>
            </div>
            <div className="flex justify-end">
              {activeNote ? (
                <button 
                  onClick={handleUpdateNote}
                  className="btn-primary"
                >
                  Update Note
                </button>
              ) : (
                <button 
                  onClick={handleCreateNote}
                  className="btn-primary"
                >
                  Save Note
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;