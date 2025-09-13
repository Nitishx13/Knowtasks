import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthHeaders } from '../../utils/auth';

const MobileQuizMaker = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { user } = useAuth();

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    subject: '',
    difficulty: 'medium',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    fetchQuizzes();
  }, [user?.id]);

  const fetchQuizzes = async () => {
    if (!user?.id) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/quizzes', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.title.trim() || !newQuiz.questions[0].question.trim()) return;
    
    try {
      const headers = await getAuthHeaders(user.id);
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers,
        body: JSON.stringify(newQuiz)
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(prev => [data.quiz, ...prev]);
        setNewQuiz({
          title: '',
          subject: '',
          difficulty: 'medium',
          questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
        });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const selectAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!activeQuiz) return { correct: 0, total: 0, percentage: 0 };
    
    let correct = 0;
    activeQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    const total = activeQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    return { correct, total, percentage };
  };

  const addQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || quiz.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Quiz Taking Mode
  if (activeQuiz && !showResults) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-gray-900 to-black text-white">
        {/* Quiz Header */}
        <div className="sticky top-0 z-10 bg-orange-900/95 backdrop-blur-sm border-b border-orange-700 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button 
              onClick={() => setActiveQuiz(null)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 text-sm"
            >
              ← Exit Quiz
            </Button>
            <div className="text-center">
              <h2 className="font-bold text-lg">{activeQuiz.title}</h2>
              <p className="text-sm text-orange-300">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</p>
            </div>
            <div className="w-20"></div>
          </div>
          
          <div className="w-full bg-orange-800 rounded-full h-2">
            <div 
              className="bg-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="px-4 py-8">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-semibold mb-6 text-white leading-relaxed">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => selectAnswer(currentQuestionIndex, index)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-orange-500 bg-orange-500/20 text-white'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-500'
                      }`}>
                        {selectedAnswers[currentQuestionIndex] === index && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3"
              >
                Previous
              </Button>
              
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3"
              >
                {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results Mode
  if (showResults && activeQuiz) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-gray-900 to-black text-white">
        <div className="px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
            >
              <div className="mb-6">
                <div className="text-6xl mb-4">
                  {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '📚'}
                </div>
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <h3 className="text-xl text-gray-300">{activeQuiz.title}</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-green-600/20 rounded-xl p-4 border border-green-600/30">
                  <p className="text-2xl font-bold text-green-400">{score.correct}</p>
                  <p className="text-sm text-green-300">Correct</p>
                </div>
                <div className="bg-red-600/20 rounded-xl p-4 border border-red-600/30">
                  <p className="text-2xl font-bold text-red-400">{score.total - score.correct}</p>
                  <p className="text-sm text-red-300">Incorrect</p>
                </div>
                <div className="bg-orange-600/20 rounded-xl p-4 border border-orange-600/30">
                  <p className="text-2xl font-bold text-orange-400">{score.percentage}%</p>
                  <p className="text-sm text-orange-300">Score</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => startQuiz(activeQuiz)}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-3"
                >
                  Retake Quiz
                </Button>
                <Button
                  onClick={() => setActiveQuiz(null)}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-3"
                >
                  Back to Quizzes
                </Button>
              </div>
            </motion.div>
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
          <h1 className="text-xl font-bold">Quiz Maker</h1>
          <div className="text-sm text-gray-400">
            {filteredQuizzes.length} quizzes
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
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex space-x-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2"
                >
                  + New Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz List */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">Your Quizzes</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-4"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-2">{quiz.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {quiz.subject && (
                          <span className="px-2 py-1 bg-orange-600 text-xs rounded-full">{quiz.subject}</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.difficulty === 'easy' ? 'bg-green-600' :
                          quiz.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {quiz.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">
                          {quiz.questions?.length || 0} questions
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => startQuiz(quiz)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 py-2 text-sm"
                    >
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No quizzes yet</h3>
              <p className="text-gray-400 mb-6">Create quizzes to test your knowledge</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Create Your First Quiz
              </Button>
            </div>
          )}
        </AnimatePresence>
          </div>
        </div>

        {/* Pro Tips Section */}
        <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-700/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quiz Tips
            </h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Create varied question types for comprehensive testing</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Include explanations to help reinforce learning</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Review quiz results to identify knowledge gaps</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Create Quiz Modal */}
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
              className="w-full max-w-2xl bg-gray-800 rounded-t-2xl sm:rounded-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Create New Quiz</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Quiz Details */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Quiz title..."
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={newQuiz.subject}
                        onChange={(e) => setNewQuiz(prev => ({ ...prev, subject: e.target.value }))}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      
                      <select
                        value={newQuiz.difficulty}
                        onChange={(e) => setNewQuiz(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Questions</h3>
                    {newQuiz.questions.map((question, qIndex) => (
                      <div key={qIndex} className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Question {qIndex + 1}</h4>
                          {newQuiz.questions.length > 1 && (
                            <button
                              onClick={() => setNewQuiz(prev => ({
                                ...prev,
                                questions: prev.questions.filter((_, i) => i !== qIndex)
                              }))}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <textarea
                          placeholder="Enter your question..."
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          rows={2}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                        
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correctAnswer === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                className="text-orange-500 focus:ring-orange-500"
                              />
                              <input
                                type="text"
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      onClick={addQuestion}
                      className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-2"
                    >
                      + Add Question
                    </Button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowCreateModal(false)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateQuiz}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      disabled={!newQuiz.title.trim() || !newQuiz.questions[0].question.trim()}
                    >
                      Create Quiz
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

export default MobileQuizMaker;
