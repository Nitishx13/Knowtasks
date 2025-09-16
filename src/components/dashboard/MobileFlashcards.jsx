import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const MobileFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { user } = useAuth();

  const [newFlashcard, setNewFlashcard] = useState({
    question: '',
    answer: '',
    subject: '',
    difficulty: 'medium'
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    fetchFlashcards();
  }, [user?.id]);

  const fetchFlashcards = async () => {
    if (!user?.id) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/flashcards', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data.flashcards || []);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = async () => {
    if (!newFlashcard.question.trim() || !newFlashcard.answer.trim()) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers,
        body: JSON.stringify(newFlashcard)
      });
      
      if (response.ok) {
        const data = await response.json();
        setFlashcards(prev => [data.flashcard, ...prev]);
        setNewFlashcard({ question: '', answer: '', subject: '', difficulty: 'medium' });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch(`/api/flashcards?id=${flashcardId}`, {
        method: 'DELETE',
        headers
      });
      
      if (response.ok) {
        setFlashcards(prev => prev.filter(card => card.id !== flashcardId));
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const startStudyMode = () => {
    if (filteredFlashcards.length === 0) return;
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredFlashcards.length);
  };

  const previousCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length);
  };

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || card.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (studyMode && filteredFlashcards.length > 0) {
    const currentCard = filteredFlashcards[currentCardIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
        {/* Study Mode Header */}
        <div className="sticky top-0 z-10 bg-purple-900/95 backdrop-blur-sm border-b border-purple-700 px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => setStudyMode(false)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 text-sm"
            >
              ← Exit Study
            </Button>
            <div className="text-center">
              <p className="text-sm text-purple-300">Card {currentCardIndex + 1} of {filteredFlashcards.length}</p>
              <div className="w-32 bg-purple-800 rounded-full h-1 mt-1">
                <div 
                  className="bg-purple-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / filteredFlashcards.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div 
              className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-8 border border-purple-600 shadow-2xl cursor-pointer transform hover:scale-105 transition-transform duration-300 min-h-[300px] flex flex-col justify-center"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div className="text-center">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-600 text-xs rounded-full">{currentCard.subject}</span>
                  <span className={`ml-2 px-3 py-1 text-xs rounded-full ${
                    currentCard.difficulty === 'easy' ? 'bg-green-600' :
                    currentCard.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                </div>
                
                <AnimatePresence mode="wait">
                  {!showAnswer ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-purple-200">Question</h3>
                      <p className="text-xl text-white leading-relaxed">{currentCard.question}</p>
                      <p className="text-sm text-purple-300 mt-6">Tap to reveal answer</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-purple-200">Answer</h3>
                      <p className="text-xl text-white leading-relaxed">{currentCard.answer}</p>
                      <p className="text-sm text-purple-300 mt-6">Tap to see question</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-purple-900/95 backdrop-blur-sm border-t border-purple-700 px-4 py-4">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <Button 
              onClick={previousCard}
              className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full"
              disabled={filteredFlashcards.length <= 1}
            >
              ← Previous
            </Button>
            <Button 
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full"
            >
              {showAnswer ? 'Show Question' : 'Show Answer'}
            </Button>
            <Button 
              onClick={nextCard}
              className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full"
              disabled={filteredFlashcards.length <= 1}
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Flashcards</h1>
          <div className="text-sm text-gray-400">
            {filteredFlashcards.length} cards
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
                  placeholder="Search flashcard sets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex space-x-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2"
                >
                  + New Set
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard Sets */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Your Flashcard Sets</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredFlashcards.length > 0 ? (
                filteredFlashcards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {card.subject && (
                              <span className="px-2 py-1 bg-purple-600 text-xs rounded-full">{card.subject}</span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              card.difficulty === 'easy' ? 'bg-green-600' :
                              card.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}>
                              {card.difficulty}
                            </span>
                          </div>
                          <h3 className="font-semibold text-white mb-2">Q: {card.question}</h3>
                          <p className="text-gray-300 text-sm">A: {card.answer}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteFlashcard(card.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🃏</div>
                  <h3 className="text-xl font-semibold mb-2">No flashcards yet</h3>
                  <p className="text-gray-400 mb-6">Create flashcards to help with your studies</p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Create Your First Flashcard
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pro Tips Section */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Study Tips
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Use spaced repetition for better memory retention</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Start with easy cards and gradually increase difficulty</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Review flashcards daily for maximum effectiveness</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Create Flashcard Modal */}
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
                  <h2 className="text-xl font-bold">Create New Flashcard</h2>
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
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newFlashcard.subject}
                      onChange={(e) => setNewFlashcard(prev => ({ ...prev, subject: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    
                    <select
                      value={newFlashcard.difficulty}
                      onChange={(e) => setNewFlashcard(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <textarea
                    placeholder="Enter your question..."
                    value={newFlashcard.question}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, question: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  
                  <textarea
                    placeholder="Enter the answer..."
                    value={newFlashcard.answer}
                    onChange={(e) => setNewFlashcard(prev => ({ ...prev, answer: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
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
                      onClick={handleCreateFlashcard}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      disabled={!newFlashcard.question.trim() || !newFlashcard.answer.trim()}
                    >
                      Create Card
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFlashcards;
